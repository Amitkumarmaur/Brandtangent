"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CaseStudiesIndex() {
  const router = useRouter()

  useEffect(() => {
    // Automatically redirect to the Vanguard Realty demo case study
    router.push("/case-studies/vanguard-realty")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-4 border-ignite-orange border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
