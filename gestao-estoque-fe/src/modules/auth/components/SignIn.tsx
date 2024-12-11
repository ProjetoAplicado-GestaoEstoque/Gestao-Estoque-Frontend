import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ISignIn } from '../types/types'
import { axiosInstance } from '@/axios/api'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

type SignInProps = {
  onClick: () => void
}

function SignIn({ onClick }: SignInProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignIn>()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin: SubmitHandler<ISignIn> = (data) => {
    axiosInstance
      .post('/api/user/auth/signin', data)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('user', JSON.stringify(res.data.user))
          onClick()
          router.push('/projetos')
        }
      })
      .catch((error) => {
        if (error.status === 401) {
          toast({
            title: 'Erro',
            description: 'Senha invalida!',
            variant: 'destructive',
          })
        }
      })
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit(handleLogin)}>
        <Card className="card-auth">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Insira seus dados para realizar o login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`${errors.email ? 'flex flex-col gap-2' : 'flex flex-col gap-4 mt-4'}`}
            >
              <Label>Email</Label>
              <Input
                {...register('email', {
                  required: {
                    value: true,
                    message: 'Email é obrigatório',
                  },
                })}
                type="email"
                className={`${errors.email ? 'input-error outline-none' : ''}`}
              />
              {errors.email && (
                <p className="msg-error">{errors.email.message}</p>
              )}
            </div>
            <div
              className={`${errors.password ? 'flex flex-col gap-2 ' : 'flex flex-col gap-4 mt-4 '}`}
            >
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
          </CardContent>
          <CardFooter className="flex flex-col w-full gap-2">
            <Button className="w-full">
              <span>Login</span>
            </Button>
            <Button onClick={onClick} variant="link">
              Já possui uma conta? Clique aqui!
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

export default SignIn
