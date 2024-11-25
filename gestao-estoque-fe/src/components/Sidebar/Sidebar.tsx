'use client'
import React, { useEffect, useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar'
import {Home, Inbox, User, TicketPlus, ChevronUp, User2, TruckIcon, WarehouseIcon} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu'
import { axiosInstance } from '@/axios/api'

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Projetos',
    url: '/projetos',
    icon: Inbox,
  },
  {
    title: 'Clientes',
    url: '/clientes',
    icon: User,
  },
  {
    title: 'Produtos',
    url: '/produtos',
    icon: TicketPlus,
  },
  {
    title: 'Fornecedores',
    url: '/fornecedor',
    icon: TruckIcon,
  },
  {
    title: 'Movimentações de Estoque',
    url: '/estoque',
    icon: WarehouseIcon,
  },
]

function SidebarComponent() {
  const [username, setUsername] = useState<string>()

  useEffect(() => {
    function fetchData() {
      axiosInstance
        .get('/api/user/370bfe38-b2ee-4739-be40-e9ad84a67be6')
        .then((res) => {
          setUsername(res.data?.message)
        })
        .catch((err) => console.log(err))
    }
    fetchData()
  }, [])
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="pt-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="pb-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  {username} {/* Adicionar username do usuário */}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default SidebarComponent
