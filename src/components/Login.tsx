"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { AuthService } from "./AuthService"

interface LoginProps {
  onLogin: () => void
  onSwitchToRegister: () => void
}

export default function Login({ onLogin, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false)

      if (!email || !password) {
        toast({
          variant: "destructive",
          title: "Error de inicio de sesión",
          description: "Por favor, complete todos los campos",
        })
        return
      }

      // Use AuthService to login
      const result = AuthService.loginUser(email, password)

      if (result.success) {
        toast({
          title: "¡Inicio de sesión exitoso!",
          description: `Bienvenido de nuevo, ${result.user?.name || email}`,
        })
        onLogin()
      } else {
        toast({
          variant: "destructive",
          title: "Error de inicio de sesión",
          description: result.message,
        })
      }
    }, 1000)
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
        <CardDescription className="text-center">
          Ingresa tus credenciales para acceder a tus estadísticas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" onClick={onSwitchToRegister}>
          ¿No tienes cuenta? Regístrate
        </Button>
      </CardFooter>
    </Card>
  )
}
