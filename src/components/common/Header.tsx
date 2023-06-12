import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";
import { Fragment } from "react";

import { signOut } from "next-auth/react";
import Image from "next/image";
import mainLogo from "../../../public/images/logos/main-logo.png";
import { Button } from "./Button";
import { Container } from "./Container";
import { NavLink } from "./NavLink";
import RenderIfAuthedElse from "./RenderIfAuthedElse";

export const MobileNavLink = ({
  href,
  onClick,
  children,
}: {
  href?: string;
  onClick?: () => undefined;
  children: React.ReactNode;
}) => {
  if (href)
    return (
      <Link href={href} className="block w-full p-2">
        <span onClick={onClick}>{children}</span>
      </Link>
    );
  return (
    <span className="block w-full p-2">
      <span onClick={onClick}>{children}</span>
    </span>
  );
};

export const MobileNavIcon = ({ open }: { open: boolean }) => {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          "origin-center transition",
          open && "scale-90 opacity-0"
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          "origin-center transition",
          !open && "scale-90 opacity-0"
        )}
      />
    </svg>
  );
};

export const MobileNavigation = ({
  mobileExtraComponents,
}: {
  mobileExtraComponents: ReactNode;
}) => {
  return (
    <Popover>
      <Popover.Button
        className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }: { open: boolean }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
          >
            <RenderIfAuthedElse
              authedComponent={
                <>
                  <MobileNavLink href="/projects">Projects</MobileNavLink>
                  <MobileNavLink href="/contactus">Contact Us</MobileNavLink>
                  {mobileExtraComponents}
                </>
              }
              notAuthedComponent={
                <>
                  <MobileNavLink href="#features">Features</MobileNavLink>
                  <MobileNavLink href="#pricing">Pricing</MobileNavLink>
                  <MobileNavLink href="#faq">FAQs</MobileNavLink>
                </>
              }
            />

            <hr className="m-2 border-slate-300/40" />
            <RenderIfAuthedElse
              authedComponent={
                <MobileNavLink href="sign-in" onClick={() => void signOut()}>
                  Sign out
                </MobileNavLink>
              }
              notAuthedComponent={
                <MobileNavLink href="sign-in">Sign in</MobileNavLink>
              }
            />
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
};

export const Header = ({
  desktopExtraComponents,
  mobileExtraComponents,
}: {
  desktopExtraComponents?: ReactNode;
  mobileExtraComponents?: ReactNode;
}) => {
  return (
    <header>
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="/" aria-label="Home">
              <Image
                className="mx-auto h-32 w-auto"
                src={mainLogo}
                alt="MySmart Portal"
              />
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              <RenderIfAuthedElse
                authedComponent={
                  <>
                    <NavLink href="/projects" target="_blank">
                      Projects
                    </NavLink>
                    <NavLink href="/contactus" target="_blank">
                      Contact Us
                    </NavLink>
                    {desktopExtraComponents}
                  </>
                }
                notAuthedComponent={
                  <>
                    <NavLink href="#features">Features</NavLink>
                    <NavLink href="#pricing">Pricing</NavLink>
                    <NavLink href="#faq">FAQs</NavLink>
                  </>
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <RenderIfAuthedElse
              authedComponent={
                //void: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void
                <div className="hidden md:block">
                  <Button href="sign-in" color="blue">
                    <span onClick={() => void signOut()}>Sign out</span>
                  </Button>
                </div>
              }
              notAuthedComponent={
                <>
                  <div className="hidden md:block">
                    <NavLink href="sign-in">Sign in</NavLink>
                  </div>
                  <Button href="sign-in" color="blue">
                    <span>
                      Get started{" "}
                      <span className="hidden lg:inline">today</span>
                    </span>
                  </Button>
                </>
              }
            />
            <div className="-mr-1 md:hidden">
              <MobileNavigation mobileExtraComponents={mobileExtraComponents} />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
};
