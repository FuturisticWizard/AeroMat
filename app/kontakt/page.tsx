"use client";

import type React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";

import { z } from "zod";
import { formSchema } from "../lib/schemas";
import { send } from "../lib/email";

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
      message: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    send(values);
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-center w-full max-w-full px-4 md:px-6 lg:px-8 py-24 md:py-20 lg:py-28 overflow-y-auto bg-black min-h-screen">
      <div className="w-full max-w-md mb-6 md:mb-0 md:mr-6">
        <div className="relative w-full h-32 md:h-96">
          <Image
            src="/placeholder.png"
            alt="image"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
      <Card className="w-full max-w-md bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">
            Napisz do Mnie!
          </CardTitle>
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
                      <FormLabel className="text-gray-200">Imię</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Twoje imię" 
                          className="bg-neutral-800 border-neutral-600 text-white placeholder:text-gray-500 focus:border-[#ff7302] focus:ring-[#ff7302]"
                          {...field} 
                        />
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
                      <FormLabel className="text-gray-200">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Twój email" 
                          className="bg-neutral-800 border-neutral-600 text-white placeholder:text-gray-500 focus:border-[#ff7302] focus:ring-[#ff7302]"
                          {...field} 
                        />
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
                      <FormLabel className="text-gray-200">Temat</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Temat wiadomości" 
                          className="bg-neutral-800 border-neutral-600 text-white placeholder:text-gray-500 focus:border-[#ff7302] focus:ring-[#ff7302]"
                          {...field} 
                        />
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
                      <FormLabel className="text-gray-200">Wiadomość</FormLabel>
                      <FormControl>
                        <Textarea
                          id="message"
                          placeholder="Napisz swoją wiadomość..."
                          className="min-h-[100px] bg-neutral-800 border-neutral-600 text-white placeholder:text-gray-500 focus:border-[#ff7302] focus:ring-[#ff7302]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#ff7302] hover:bg-[#e56502] text-white font-semibold"
              >
                Wyślij wiadomość
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
