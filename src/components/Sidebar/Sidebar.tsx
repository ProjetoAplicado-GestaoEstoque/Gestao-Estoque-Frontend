'use client'
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
import {
  Home,
  Inbox,
  User,
  TicketPlus,
  ChevronUp,
  User2,
  TruckIcon,
  WarehouseIcon,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu'

const items = [
  {
    title: 'Dashboard',
    url: '/',
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

type SidebarProps = {
  fullName: string
  logout: () => void
}

function SidebarComponent({ fullName, logout }: SidebarProps) {
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
                  {fullName || 'Usuário não encontrado'}
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
                <DropdownMenuItem onClick={() => logout()}>
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
