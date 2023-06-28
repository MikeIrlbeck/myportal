import { z } from "zod";
import { projectIdSchema } from "./project";

const prefixSchema = z.object({
  prefix: z.string(),
});

const awsBucketNameSchema = z.object({
  aws_s3_bucket_name: z.string(),
});

export const fetchS3BucketContentsSchema = prefixSchema
  .merge(awsBucketNameSchema)
  .merge(projectIdSchema);

export const createFolderSchema = fetchS3BucketContentsSchema.extend({
  folderName: z.string(),
});

export const getPreSignedURLForDownloadSchema = z
  .object({
    fileId: z.string(),
  })
  .merge(awsBucketNameSchema)
  .merge(projectIdSchema);

export const getPreSignedURLForUploadSchema = getPreSignedURLForDownloadSchema;

export const deleteS3ObjectSchema =
  getPreSignedURLForDownloadSchema.merge(prefixSchema);
