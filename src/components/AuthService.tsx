import emailjs from "@emailjs/browser"

// Email service configuration
const EMAIL_SERVICE_ID = "service_nft5ksc" // EmailJS service ID
const EMAIL_TEMPLATE_ID = "template_i7l4wad" // EmailJS template ID
const EMAIL_PUBLIC_KEY = "dXWqxJR0wcUfqxO7Y" // EmailJS public key

export interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: Date
}

export class AuthService {
  private static USERS_KEY = "registered_users"

  // Initialize EmailJS (call this in your main app)
  static initEmailJS() {
    emailjs.init(EMAIL_PUBLIC_KEY)
  }

  // Get all registered users
  static getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY)
    return users ? JSON.parse(users) : []
  }

  // Save users to localStorage
  static saveUsers(users: User[]) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
  }

  // Check if email is already registered
  static isEmailRegistered(email: string): boolean {
    const users = this.getUsers()
    return users.some((user) => user.email.toLowerCase() === email.toLowerCase())
  }

  // Register a new user
  static async registerUser(
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Check if email is already registered
      if (this.isEmailRegistered(email)) {
        return { success: false, message: "Este correo ya está registrado" }
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email: email.toLowerCase(),
        password, // In a real app, this should be hashed
        createdAt: new Date(),
      }

      // Save user
      const users = this.getUsers()
      users.push(newUser)
      this.saveUsers(users)

      // Send welcome email
      await this.sendWelcomeEmail(name, email)

      return {
        success: true,
        message: "Usuario registrado exitosamente. Revisa tu correo para el mensaje de bienvenida.",
      }
    } catch (error) {
      console.error("Error registering user:", error)
      return { success: false, message: "Error al registrar usuario. Inténtalo de nuevo." }
    }
  }

  // Login user
  static loginUser(email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers()
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (user) {
      // Store current user session
      localStorage.setItem("user", JSON.stringify({ name: user.name, email: user.email }))
      return { success: true, message: "Inicio de sesión exitoso", user }
    } else {
      return { success: false, message: "Correo o contraseña incorrectos" }
    }
  }

  // Send welcome email
  static async sendWelcomeEmail(name: string, email: string): Promise<void> {
    try {
      const templateParams = {
        to_name: name,
        to_email: email,
        from_name: "Baseball Stats Central",
        message: `¡Bienvenido a Baseball Stats Central, ${name}! 

Gracias por registrarte en nuestra plataforma. Ahora puedes:

✅ Registrar tus estadísticas de bateo y pitcheo
✅ Calcular estadísticas avanzadas automáticamente  
✅ Exportar reportes en PDF
✅ Llevar un seguimiento completo de tu rendimiento

¡Esperamos que disfrutes usando nuestra aplicación!

Saludos,
El equipo de Baseball Stats Central`,
      }

      await emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams)
    } catch (error) {
      console.error("Error sending welcome email:", error)
      // Don't throw error - registration should still succeed even if email fails
    }
  }

  // Logout user
  static logoutUser(): void {
    localStorage.removeItem("user")
  }

  // Get current user
  static getCurrentUser(): { name?: string; email: string } | null {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  }
}
