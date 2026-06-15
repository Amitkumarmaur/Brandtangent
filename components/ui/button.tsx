import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none rounded-sm",
  {
    variants: {
      variant: {
        /* Primary — near-black CTA (Webflow canonical) */
        default:
          'bg-primary text-primary-foreground hover:bg-ink-strong active:opacity-90 transition-colors',
        /* Secondary outline — white + hairline border */
        outline:
          'bg-background text-foreground border border-border hover:bg-secondary hover:border-muted-foreground/30 transition-colors',
        /* On dark — white fill, ink text */
        secondary:
          'bg-background text-foreground border border-border hover:bg-secondary transition-colors',
        /* Ghost — no border, subtle hover */
        ghost:
          'bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors',
        /* Cream — warm surface button */
        cream:
          'bg-secondary text-foreground border border-border hover:bg-muted transition-colors',
        /* Destructive */
        destructive:
          'bg-destructive text-destructive-foreground hover:opacity-90',
        /* Link */
        link:
          'text-foreground underline-offset-4 hover:underline rounded-none px-0',
        /* Dark band CTA */
        dark:
          'bg-primary text-primary-foreground hover:bg-ink-strong transition-colors',
      },
      size: {
        default: 'h-11 px-5 py-3 text-base tracking-[-0.16px]',
        sm:      'h-9 px-4 py-2 text-sm',
        lg:      'h-12 px-7 py-3 text-base tracking-[-0.16px]',
        icon:    'size-11 rounded-full',
        'icon-sm': 'size-9 rounded-full',
        'icon-lg': 'size-12 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
