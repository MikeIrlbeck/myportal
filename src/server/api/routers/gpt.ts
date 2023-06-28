import { OpenAI } from "langchain/llms/openai";
import {
  OutputFixingParser,
  StructuredOutputParser,
} from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import type { z } from "zod";
import { env } from "../../../env/server.mjs";
import { extractInvoiceInfoSchema, gptOutputSchema } from "../../../schema/gpt";
import { trycatch } from "../../../utils/trycatch";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export type gptOutputSchema = z.infer<typeof gptOutputSchema>;

export const config = {
  runtime: "edge",
};

export const gptRouter = createTRPCRouter({
  extractInvoiceInfo: protectedProcedure
    .input(extractInvoiceInfoSchema)
    .mutation(async ({ input }) => {
      return await trycatch({
        fn: async () => {
          const parser = StructuredOutputParser.fromZodSchema(gptOutputSchema);
          const formatInstructions = parser.getFormatInstructions();

          const prompt = new PromptTemplate({
            template: `Ensure that all fields in the JSON headings are filled, and any missing input is represented as 0.\nTreat synonymous terms like total, final cost, total payable, etc., as grand_total.\n Ensure to thoroughly check the extracted information before finalising the output.\n Take your time and avoid confusion between "quantity" and "unit_price". Determine which one is closest to having a monetary value or being a currency.\n Lastly, MAKE SURE all inputs ARE DETECTED, DO NOT MISS any.\n Please RUN the prompt TWICE before providing the output.\n {format_instructions}\nUser input: \n{user_input}`,
            inputVariables: ["user_input"],
            partialVariables: { format_instructions: formatInstructions },
          });

          const model = new OpenAI({
            temperature: 0,
            openAIApiKey: env.OPENAI_API_KEY,
            modelName: "gpt-3.5-turbo",
            maxTokens: -1,
          });

          const promptInput = await prompt.format({
            user_input: input.inputText,
          });

          const response = await model.call(promptInput);

          // Bad response - this will fail on await parser.parse(response); This is only here to test the fixParser code block.
          //   const response = `{ "vendor_name": "Global Wholesaler Azure Interior" "invoice_no": "INV/2023/03/0008", "invoice_date": "03/20/2023", "items": [ { "description": "Beeswax XL Acme beeswax", "unit": "kg", "quantity": 1, "unit_price": 42.00, "element_cost": 42.00 }, { "description": "Office Chair", "unit": "Units", "quantity": 1, "unit_price": 70.00, "element_cost": 70.00 }, { "description": "Olive Oil", "unit": "L", "quantity": 1, "unit_price": 10.00, "element_cost": 10.00 }, { "description": "Luxury Truffles", "unit": "g", "quantity": 15, "unit_price": 10.00, "element_cost": 150.00 } ], "subtotal": 262.90, "tax": 16.94, "discount": 0, "total_sum": 279.84 }`;

          try {
            // await new Promise((r) => setTimeout(r, 2000));
            // return {
            //   invoiceNo: "780820",
            //   invoiceDate: "30/11/2022",
            //   supplierName: "Plywood Sdn Bhd",
            //   subtotal: 278,
            //   taxes: 13.9,
            //   discount: 0,
            //   grandTotal: 291.9,
            //   supplierInvoiceItems: [
            //     {
            //       description: "Plywood Type 1",
            //       quantity: 10,
            //       unit: "M2",
            //       unitPrice: 5,
            //       totalPrice: 50,
            //     },
            //     {
            //       description: "Plywood Type 2",
            //       quantity: 20,
            //       unit: "M2",
            //       unitPrice: 24,
            //       totalPrice: 48,
            //     },
            //     {
            //       description: "Plywood Type 3",
            //       quantity: 120,
            //       unit: "M2",
            //       unitPrice: 30,
            //       totalPrice: 180,
            //     },
            //   ],
            // };
            return await parser.parse(response);
          } catch (e) {
            const fixParser = OutputFixingParser.fromLLM(
              new OpenAI({
                temperature: 0,
                openAIApiKey: env.OPENAI_API_KEY,
                modelName: "gpt-3.5-turbo",
                maxTokens: -1,
              }),
              parser
            );
            return await fixParser.parse(response);
          }
        },
        errorMessages: ["Failed to extract information"],
      })();
    }),
});
