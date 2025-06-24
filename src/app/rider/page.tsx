/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Shield,
  DollarSign,
  Star,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Users,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function BecomeRider() {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    vehicleType: "",
    experience: "",
    license: "",
    availability: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-20 pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <Badge className="bg-[#FF6600] text-white hover:bg-[#FF6600] text-sm px-4 py-2">
                🚴‍♂️ Join Our Growing Team • Earn More Today
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold text-[#1A2E20] leading-tight">
                Become a
                <span className="text-[#FF6600]"> Delivery Partner</span>
                <br />
                Earn on Your Schedule
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Join thousands of delivery partners earning competitive income
                with flexible hours. Whether you have a bike, motorcycle, or car
                - start earning today across our growing network.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                  size="lg"
                  className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-8 py-6 text-lg"
                  onClick={() =>
                    document
                      .getElementById("application-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                {/* <Button
                  variant="outline"
                  size="lg"
                  className="border-[#1A2E20] text-[#1A2E20] hover:bg-[#1A2E20] hover:text-white px-8 py-6 text-lg"
                >
                  Learn More
                </Button> */}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#FF6600]" />
                  <span>No Experience Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#FF6600]" />
                  <span>Weekly Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#FF6600]" />
                  <span>Free Training</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-semibold text-[#1A2E20] mb-2">
              Join Our Growing Community
            </h2>
            <p className="text-gray-600">
              Real numbers from our delivery partner network
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "2,000+", label: "Active Riders", icon: Users },
              {
                number: "$800",
                label: "Average Monthly Earnings",
                icon: DollarSign,
              },
              { number: "4.8★", label: "Partner Rating", icon: Star },
              { number: "24/7", label: "Support Available", icon: Clock },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-3">
                  <stat.icon className="h-6 w-6 text-[#FF6600]" />
                </div>
                <div className="text-2xl font-bold text-[#1A2E20] mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#1A2E20] mb-4">
              Why Choose Us as Your Partner?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide everything you need to succeed as a delivery partner
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Clock,
                title: "Flexible Schedule",
                description:
                  "Work when you want, where you want. Set your own hours and take breaks whenever you need.",
              },
              {
                icon: DollarSign,
                title: "Competitive Earnings",
                description:
                  "Earn competitive rates per delivery plus tips. Weekly payments directly to your bank account.",
              },
              {
                icon: Smartphone,
                title: "Easy-to-Use App",
                description:
                  "Simple mobile app to manage deliveries, track earnings, and communicate with customers.",
              },
              {
                icon: Shield,
                title: "Insurance Coverage",
                description:
                  "Comprehensive insurance coverage while you're on delivery to keep you protected.",
              },
              {
                icon: TrendingUp,
                title: "Performance Bonuses",
                description:
                  "Earn extra with performance bonuses, peak hour incentives, and loyalty rewards.",
              },
              {
                icon: Users,
                title: "Community Support",
                description:
                  "Join a community of riders with 24/7 support, training programs, and career growth opportunities.",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-md transition-shadow border-l-4 border-l-[#FF6600]">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
                      <benefit.icon className="h-6 w-6 text-[#FF6600]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1A2E20] mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Types Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#1A2E20] mb-4">
              Any Vehicle, Any Time
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We welcome all types of vehicles - choose what works best for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "Bicycle",
                description: "Perfect for city centers and short distances",
                icon: "🚲",
                earnings: "$15-25/hour",
              },
              {
                title: "Motorcycle",
                description: "Fast and efficient for all delivery types",
                icon: "🏍️",
                earnings: "$20-35/hour",
              },
              {
                title: "Car",
                description: "Ideal for larger orders and longer distances",
                icon: "🚗",
                earnings: "$25-40/hour",
              },
              {
                title: "Van/Truck",
                description: "Perfect for bulk deliveries and groceries",
                icon: "🚐",
                earnings: "$30-50/hour",
              },
            ].map((vehicle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{vehicle.icon}</div>
                    <h3 className="text-lg font-semibold text-[#1A2E20] mb-2">
                      {vehicle.title}
                    </h3>
                    <p className="text-gray-600 mb-3 text-sm">
                      {vehicle.description}
                    </p>
                    <div className="text-[#FF6600] font-semibold text-sm">
                      {vehicle.earnings}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#1A2E20] mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start earning in 3 simple steps
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Apply Online",
                  description:
                    "Fill out our simple application form with your basic information and vehicle details.",
                },
                {
                  step: "2",
                  title: "Get Approved",
                  description:
                    "We'll review your application and verify your documents. Most approvals happen within 24 hours.",
                },
                {
                  step: "3",
                  title: "Start Earning",
                  description:
                    "Download our app, complete the quick training, and start accepting delivery requests immediately.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-[#FF6600] text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A2E20] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#1A2E20] mb-4">
              What Our Riders Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from delivery partners earning with us
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "James Wilson",
                role: "Motorcycle Rider",
                text: "I've been riding for 8 months now and consistently earn NGN200,000+ monthly. The flexibility allows me to balance work with my studies perfectly.",
                rating: 5,
                earnings: "NGN200,000/month",
              },
              {
                name: "Maria Santos",
                role: "Car Driver",
                text: "The support team is amazing and the app is so easy to use. I love being able to work around my family schedule and still earn good money.",
                rating: 5,
                earnings: "NGN550000/month",
              },
              {
                name: "David Chen",
                role: "Bicycle Courier",
                text: "Started part-time and now it's my main income. Great way to stay fit while earning money. The bonuses during peak hours really add up!",
                rating: 5,
                earnings: "NGN150000/month",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-t-4 border-t-[#FF6600]">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-[#FF6600] fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="font-semibold text-[#1A2E20]">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {testimonial.role}
                        </div>
                      </div>
                      <div className="text-[#FF6600] font-semibold text-sm">
                        {testimonial.earnings}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section
        id="application-form"
        className="py-20 bg-gradient-to-br from-gray-50 to-orange-50"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#1A2E20] mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fill out the application below and join our team of successful
              delivery partners
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e: { target: { value: string } }) =>
                          handleChange("fullName", e.target.value)
                        }
                        className="focus:ring-[#FF6600] focus:border-[#FF6600]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e: { target: { value: string } }) =>
                          handleChange("email", e.target.value)
                        }
                        className="focus:ring-[#FF6600] focus:border-[#FF6600]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e: { target: { value: string } }) =>
                          handleChange("phone", e.target.value)
                        }
                        className="focus:ring-[#FF6600] focus:border-[#FF6600]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e: { target: { value: string } }) =>
                          handleChange("city", e.target.value)
                        }
                        className="focus:ring-[#FF6600] focus:border-[#FF6600]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleType">Vehicle Type</Label>
                      <Select
                        value={formData.vehicleType}
                        onValueChange={(value: string) =>
                          handleChange("vehicleType", value)
                        }
                      >
                        <SelectTrigger className="focus:ring-[#FF6600] focus:border-[#FF6600]">
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bicycle">Bicycle</SelectItem>
                          <SelectItem value="motorcycle">Motorcycle</SelectItem>
                          <SelectItem value="car">Car</SelectItem>
                          <SelectItem value="van">Van/Truck</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Delivery Experience</Label>
                      <Select
                        value={formData.experience}
                        onValueChange={(value: string) =>
                          handleChange("experience", value)
                        }
                      >
                        <SelectTrigger className="focus:ring-[#FF6600] focus:border-[#FF6600]">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No experience</SelectItem>
                          <SelectItem value="less-than-1">
                            Less than 1 year
                          </SelectItem>
                          <SelectItem value="1-2">1-2 years</SelectItem>
                          <SelectItem value="2-plus">2+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="license">Driver's License Number</Label>
                      <Input
                        id="license"
                        value={formData.license}
                        onChange={(e: { target: { value: string } }) =>
                          handleChange("license", e.target.value)
                        }
                        className="focus:ring-[#FF6600] focus:border-[#FF6600]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability</Label>
                      <Select
                        value={formData.availability}
                        onValueChange={(value: string) =>
                          handleChange("availability", value)
                        }
                      >
                        <SelectTrigger className="focus:ring-[#FF6600] focus:border-[#FF6600]">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full Time</SelectItem>
                          <SelectItem value="part-time">Part Time</SelectItem>
                          <SelectItem value="weekends">
                            Weekends Only
                          </SelectItem>
                          <SelectItem value="flexible">
                            Flexible Hours
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#FF6600] hover:bg-[#e55a00] text-white py-6 text-lg"
                  >
                    Submit Application
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <p className="text-center text-sm text-gray-600">
                    By submitting this application, you agree to our terms and
                    conditions. We'll contact you within 24 hours.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2E20] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">
              Questions About Becoming a Rider?
            </h3>
            <p className="text-gray-400 mb-6">
              Email: riders@betadayapp.com | Support available 24/7
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 BetaDay. Empowering delivery partners across Africa.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
