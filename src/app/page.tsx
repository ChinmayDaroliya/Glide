import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, CheckCircle2 } from "lucide-react"

export default function Home() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-600/20 to-emerald-500/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Trusted by 1,000+ businesses</span>
          </div>

          {/* Heading */}
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Automate your Instagram DMs and comments with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              AI
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Replace your DM setters with a trained AI chatbot that closes leads while you sleep. 
            Stop losing sales to slow responses.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button 
              size="lg" 
              asChild 
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:from-blue-700 hover:to-emerald-600"
            >
              <Link href="#pricing">
                Start free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="#how-it-works">
                <Play className="mr-2 h-4 w-4" />
                Watch demo
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>From startups to established brands</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>5 minute setup</span>
            </div>
          </div>
        </div>

        {/* Hero visual - Mock DM Interface */}
        <div className="mt-16 sm:mt-20">
          <div className="relative mx-auto max-w-4xl">
            <div className="rounded-2xl border border-border bg-card p-2 shadow-2xl">
              <div className="rounded-xl bg-muted/50 p-6">
                <div className="flex items-center gap-4 border-b border-border pb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500" />
                  <div>
                    <p className="font-medium text-foreground">AI Assistant</p>
                    <p className="text-sm text-muted-foreground">Active now</p>
                  </div>
                  <div className="ml-auto flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500">
                    <span className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-500/60" />
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl rounded-bl-none bg-muted px-4 py-3">
                      <p className="text-sm text-foreground">
                        Hey! I saw your post about the new product. Is it still available?
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-none bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-3">
                      <p className="text-sm text-white">
                        Hi there! Yes, it's absolutely still available. Would you like me to send you the link to order? I can also answer any questions you have about it.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl rounded-bl-none bg-muted px-4 py-3">
                      <p className="text-sm text-foreground">
                        Yes please! What's the price?
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce-stagger rounded-full bg-blue-600" />
                      <span className="h-2 w-2 animate-bounce-stagger rounded-full bg-blue-600" />
                      <span className="h-2 w-2 animate-bounce-stagger rounded-full bg-blue-600" />
                    </div>
                    <span>AI is typing...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}