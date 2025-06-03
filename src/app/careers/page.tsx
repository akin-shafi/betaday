/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Form, Input, Select, Button, message, Upload } from "antd";
import { useState } from "react";
import { motion } from "framer-motion";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, RcFile } from "antd/es/upload/interface";

const { TextArea } = Input;
const { Option } = Select;

const roleRequirements = {
  "Operations Manager": [
    "B.Sc or HND in Business Administration, Marketing, or any related field",
    "Preferably a young graduate with 2–4 years experience in vendor relations, customer service, or sales",
  ],
  Rider: [
    "Minimum SSCE",
    "Physical Fitness",
    "Good communication and basic knowledge of the local area",
    "Ability to use Apps like Google Map",
    "Having a bicycle is a plus",
  ],
  "Sales Rep": [
    "OND or school Leaver",
    "Basic Computer literacy and good English speaking",
    "Experience with phone/email support or call center work is a plus",
  ],
};

// Google Form ID and entry IDs
const GOOGLE_FORM_ID =
  "1FAIpQLSfjtN8hu9YqiCvHyin-6DfNwv4pdQoEVHd8WHvl2DzmMo-k2g";
const ENTRY_IDS = {
  fullName: "1116789711",
  email: "1140767649",
  phone: "134624067",
  address: "1981438900",
  role: "1159938232",
  experience: "214577486",
  coverLetter: "1382514208",
  resume: "1494277682",
};

export default function CareersPage() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);

      if (!selectedRole) {
        message.error("Please select a position");
        setIsSubmitting(false);
        return;
      }

      if (fileList.length === 0) {
        message.error("Please upload your resume");
        setIsSubmitting(false);
        return;
      }

      // Create a hidden form
      const hiddenForm = document.createElement("form");
      hiddenForm.method = "POST";
      hiddenForm.action = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
      hiddenForm.style.display = "none";

      // Add required Google Form parameters
      const addHiddenField = (name: string, value: string) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        hiddenForm.appendChild(input);
      };

      addHiddenField("fvv", "1");
      addHiddenField("draftResponse", "[]");
      addHiddenField("pageHistory", "0");
      addHiddenField("fbzx", "-1234567890123456789");

      // Add form fields
      addHiddenField(`entry.${ENTRY_IDS.fullName}`, values.fullName);
      addHiddenField(`entry.${ENTRY_IDS.email}`, values.email);
      addHiddenField(`entry.${ENTRY_IDS.phone}`, values.phone);
      addHiddenField(`entry.${ENTRY_IDS.address}`, values.address);
      addHiddenField(`entry.${ENTRY_IDS.role}`, selectedRole);
      addHiddenField(`entry.${ENTRY_IDS.experience}`, values.experience);
      addHiddenField(`entry.${ENTRY_IDS.coverLetter}`, values.coverLetter);

      // Add resume file if uploaded
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.name = `entry.${ENTRY_IDS.resume}`;
        fileInput.files = new DataTransfer().files;
        hiddenForm.appendChild(fileInput);
      }

      // Add form to document and submit
      document.body.appendChild(hiddenForm);
      hiddenForm.submit();
      document.body.removeChild(hiddenForm);

      // Show success message after a short delay
      setTimeout(() => {
        message.success("Application submitted successfully!");
        form.resetFields();
        setFileList([]);
        setSelectedRole("");
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("Submission error:", error);
      message.error("Failed to submit application. Please try again.");
      setIsSubmitting(false);
    }
  };

  const uploadProps = {
    onRemove: (file: UploadFile) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: RcFile) => {
      // Check file type
      const isPDF = file.type === "application/pdf";
      const isDoc = file.type === "application/msword";
      const isDocx =
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      if (!isPDF && !isDoc && !isDocx) {
        message.error("You can only upload PDF, DOC, or DOCX files!");
        return false;
      }

      // Check file size (5MB limit)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("File must be smaller than 5MB!");
        return false;
      }

      setFileList([file]);
      return false;
    },
    fileList,
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#fdf6e9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-28">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Join Our Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {`We're`} looking for passionate individuals to help us
            revolutionize the food delivery industry. Join us in our mission to
            make food delivery more efficient and enjoyable for everyone.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 justify-center items-start">
          {/* Role Requirements and Application Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-8 rounded-lg shadow-lg lg:w-1/2"
          >
            <h2 className="text-2xl font-semibold mb-6">Available Positions</h2>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="space-y-4"
            >
              <Form.Item
                name="role"
                label="Select Position"
                rules={[{ required: true, message: "Please select a position" }]}
              >
                <Select
                  placeholder="Select a position"
                  onChange={(value) => setSelectedRole(value)}
                >
                  <Option value="Operations Manager">Operations Manager</Option>
                  <Option value="Rider">Rider</Option>
                  <Option value="Sales Rep">Sales Representative</Option>
                </Select>
              </Form.Item>

              <div className="mt-6">
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  {selectedRole
                    ? `${selectedRole} Requirements`
                    : "Position Requirements"}
                </h3>
                {selectedRole ? (
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    {roleRequirements[
                      selectedRole as keyof typeof roleRequirements
                    ].map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">
                    Select a position to view requirements
                  </p>
                )}
              </div>

              {/* Job Application Form Fields */}
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter your full name" },
                ]}
              >
                <Input placeholder="Enter your full name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input placeholder="Enter your phone number" />
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
                rules={[
                  { required: true, message: "Please enter your address" },
                ]}
              >
                <TextArea rows={3} placeholder="Enter your complete address" />
              </Form.Item>

              <Form.Item
                name="experience"
                label="Years of Experience"
                rules={[
                  {
                    required: true,
                    message: "Please enter your years of experience",
                  },
                ]}
              >
                <Input type="number" placeholder="Enter years of experience" />
              </Form.Item>

              <Form.Item
                name="resume"
                label="Resume"
                validateStatus={fileList.length === 0 ? "error" : "success"}
                help={fileList.length === 0 ? "Please upload your resume" : ""}
              >
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
              </Form.Item>
              <p className="text-sm text-gray-500 mt-2">
                Upload your resume (PDF, DOC, or DOCX, max 5MB)
              </p>

              <Form.Item
                name="coverLetter"
                label="Cover Letter"
                rules={[
                  { required: true, message: "Please write a cover letter" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Tell us why you're the perfect fit for this role"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </Form.Item>
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}