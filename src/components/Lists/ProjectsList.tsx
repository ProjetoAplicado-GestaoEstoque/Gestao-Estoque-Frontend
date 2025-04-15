/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React from 'react'
import { Card } from '@/components/ui/card'

import ProjectTable from '../Tables/Projects/project-data-table'
import { columns } from '../Tables/Projects/columns'
import { useProjects } from '@/hooks/Projects'

export function ProjectsList() {
  const { data, isLoading } = useProjects()

  return (
    <div className="w-full p-6">
      <Card>
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Projetos</h2>
              <p className="text-muted-foreground">
                Aqui esta a sua lista de projetos!
              </p>
            </div>
          </div>
          <ProjectTable
            data={data || []}
            loading={isLoading}
            columns={columns}
          />
        </div>
      </Card>
    </div>
  )
}
