import { Button } from "../common/Button";
import { Container } from "../common/Container";

export const Hero = () => {
  return (
    <Container className="pb-16 pt-20 text-center lg:py-48">
      <h1 className="font-display mx-auto max-w-4xl text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
        Financial{" "}
        <span className="relative whitespace-nowrap text-blue-600">
          <svg
            aria-hidden="true"
            viewBox="0 0 418 42"
            className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70"
            preserveAspectRatio="none"
          >
            <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
          </svg>
          <span className="relative">Automation</span>
        </span>{" "}
        for Construction Contractors.
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
        Your new personal assistant to speed up your invoice recording process
        and manage your accounts payable better.
      </p>
      <div className="py-4">
        <a
          href="https://www.youtube.com/watch?v=C_lheSLTTuQ"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button color="blue">
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                className="h-6 w-6 sm:h-8 sm:w-8"
                fill="#ffffff"
              >
                <path d="M382-306.667 653.333-480 382-653.333v346.666ZM480-80q-82.333 0-155.333-31.5t-127.334-85.833Q143-251.667 111.5-324.667T80-480q0-83 31.5-156t85.833-127q54.334-54 127.334-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.333-31.5 155.333T763-197.333Q709-143 636-111.5T480-80Zm0-66.666q139.333 0 236.334-97.334 97-97.333 97-236 0-139.333-97-236.334-97.001-97-236.334-97-138.667 0-236 97Q146.666-619.333 146.666-480q0 138.667 97.334 236 97.333 97.334 236 97.334ZM480-480Z" />
              </svg>
              <span className=" text-center sm:text-xl">Watch Demo</span>
            </div>
          </Button>
        </a>
      </div>
    </Container>
  );
};
