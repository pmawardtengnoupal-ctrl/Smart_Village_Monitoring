'use client'
import React from 'react'
import GrievanceForm from '@features/public/GrievanceForm'
export default function GrievanceNew(){
  return (
    <div className="rounded-xl border bg-white p-4 animate-fadeIn">
      <div className="text-sm font-semibold mb-2">Raise a grievance</div>
      <GrievanceForm/>
    </div>
  )
}
