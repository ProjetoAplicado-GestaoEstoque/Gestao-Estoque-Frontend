import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { ISignUp, Roles } from '../types/types'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { axiosInstance } from '@/axios/api'
import { cryptPassword } from '../services/crypt'
import { useToast } from '@/hooks/use-toast'

type SignUpProps = {
  onClick: () => void
}

const schema = z.object({
  full_name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.nativeEnum(Roles).default(Roles.project_manager),
})

function SignUp({ onClick }: SignUpProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ISignUp>({
    resolver: zodResolver(schema),
  })
  const { toast } = useToast()

  const handleLogin: SubmitHandler<ISignUp> = (data) => {
    cryptPassword(data.password).then((hash) => {
      if (hash) {
        data.password = hash
      }
      axiosInstance
        .post('/api/user/auth/signup', data)
        .then((res) => {
          if (res.status === 200) {
            toast({
              title: 'Sucesso',
              description: 'Usuário criado com sucesso',
              variant: 'default',
            })
            onClick()
          }
        })
        .catch((error) => {
          toast({
            title: 'Erro',
            description: 'Erro ao criar usuário! Tente novamente',
            variant: 'destructive',
          })

          console.error(error)
        })
    })
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit(handleLogin)}>
        <Card className="card-auth">
          <CardHeader>
            <CardTitle>Registre-se</CardTitle>
            <CardDescription>
              Insira seus dados para criar uma conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Label>Nome Completo</Label>
              <Input
                {...register('full_name', {
                  required: {
                    value: true,
                    message: 'Nome completo é obrigatório',
                  },
                })}
              />
              {errors.full_name && (
                <p className="msg-error">{errors.full_name.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <Label>Email</Label>
              <Input
                {...register('email', {
                  required: {
                    value: true,
                    message: 'Email é obrigatório',
                  },
                })}
              />
              {errors.email && (
                <p className="msg-error">{errors.email.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <Label>Password</Label>
              <Input
                {...register('password', {
                  required: {
                    message: 'Senha é obrigatório',
                    value: true,
                  },
                })}
                type="password"
                className={`${errors.password ? 'input-error outline-none' : ''}`}
              />
              {errors.password && (
                <p className="msg-error">{errors.password.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <Label>Escolha o seu cargo</Label>
              <div className="flex flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <Checkbox
                        onClick={() => field.onChange(Roles.tech_responsible)}
                        {...field}
                        value={Roles.tech_responsible}
                      />
                    )}
                  />
                  <Label htmlFor="responsible-tech">Tecnico Responsavel</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <Checkbox
                        onClick={() => field.onChange(Roles.project_manager)}
                        {...field}
                        value={Roles.project_manager}
                      />
                    )}
                  />
                  <Label htmlFor="project-manager">Gerente de Projetos</Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full">
              <span>Registrar</span>
            </Button>
            <Button onClick={onClick} variant="link" className="mt-4">
              Já possui uma conta? Clique aqui!
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

export default SignUp
