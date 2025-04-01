"use client"

import type React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
 
import { z } from "zod"
import { formSchema } from "../lib/schemas"
import { send } from "../lib/email"



export default function ContactForm() {
  // const [formData, setFormData] = useState({
  //   firstName: "",
  //   email: "",
    
  //   message: "",
  // })

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target

  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //     [email]: value,
  //     [title]: value,
  //     [message]: value,
  //   }))
  // }

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   // Here you would typically send the form data to your backend
  //   console.log("Form submitted:", formData)
  //   // Reset form after submission
  //   setFormData({ firstName: "",  email: "", message: "" })
  // }
   // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      email: "",
      title: "",
      message: ""
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    send(values);
    console.log(values)
  }
  
  return (
    <div className="flex flex-col md:flex-row justify-center items-center w-full max-w-full px-4 md:px-6 lg:px-8 py-24 md:py-20 lg:py-28 overflow-y-auto">
    <div className="w-full max-w-md mb-6 md:mb-0 md:mr-6">
      <div className="relative w-full h-32 md:h-96">
        <Image src='/placeholder.png' alt="image" fill className="object-cover rounded-lg" />
      </div>
    </div>
      <Card className="w-full max-w-md ">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Napisz do Mnie!</CardTitle>
        </CardHeader>
        
          <CardContent className="space-y-1 lsm:space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-1 lsm:space-y-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
            <div className="space-y-1 lsm:space-y-2">
              <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <div className="space-y-1 lsm:space-y-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temat</FormLabel>
                    <FormControl>
                      <Input placeholder="Temat wiadomości" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
            <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                      <Textarea
                        id="message"
                        placeholder="Type your message here" 
                        className="min-h-[100px]"
                        {...field} 
                      />

                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             
            </div>
            <Button type="submit" className="w-full">
              Submit
            </Button>
            </form>
          </Form>
          </CardContent>
      </Card>
    </div>
 
  )
}

