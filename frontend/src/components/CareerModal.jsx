import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle, Upload, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.pdf,.doc,.docx,.ppt,.pptx";
const MAX_FILE_MB = 10;

const inputClass =
  "w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors";

const CareerModal = ({ open, onClose }) => {
  const { toast } = useToast();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    jobTitle: "",
    message: "",
  });
  const [cvFile, setCvFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrors((err) => ({ ...err, cv: "Unsupported file type. Please upload a JPG, PNG, PDF, DOC, or PPT file." }));
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setErrors((err) => ({ ...err, cv: `File must be under ${MAX_FILE_MB} MB.` }));
      return;
    }
    setCvFile(file);
    setErrors((err) => ({ ...err, cv: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Valid email is required";
    if (!form.jobTitle.trim()) newErrors.jobTitle = "Job title is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    if (!cvFile) newErrors.cv = "Please upload your CV";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append("cv", cvFile);

      const apiEndpoint = import.meta.env.PROD
        ? "/api/career"
        : "http://localhost:5000/api/career";

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit application");

      setSubmitted(true);
      toast({ title: "Application submitted!", description: "We'll review your application and get back to you." });
    } catch (error) {
      console.error("Career form error:", error);
      toast({
        title: "Submission failed",
        description: "Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setForm({ firstName: "", lastName: "", phone: "", email: "", jobTitle: "", message: "" });
      setCvFile(null);
      setErrors({});
      setSubmitted(false);
    }, 300);
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-2xl bg-background rounded-xl shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background z-10 rounded-t-xl">
                <div>
                  <h2 className="text-xl font-bold font-['Montserrat'] text-foreground">Apply for a Career</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Join the Afnan Property Care team</p>
                </div>
                <button
                  onClick={handleClose}
                  aria-label="Close modal"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                    <h3 className="text-2xl font-bold font-['Montserrat'] text-foreground">Application Sent!</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                      Thank you for your interest. We'll review your application and reach out soon.
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-6 px-6 py-2.5 rounded-md bg-accent text-accent-foreground text-sm font-semibold hover:brightness-110 transition-all"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {/* First & Last Name */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">First Name *</label>
                        <input
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="John"
                        />
                        {errors.firstName && (
                          <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Last Name *</label>
                        <input
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="Doe"
                        />
                        {errors.lastName && (
                          <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phone & Email */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Phone *</label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="+971-504200736"
                        />
                        {errors.phone && (
                          <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="you@email.com"
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Job Title */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Job Title *</label>
                      <input
                        name="jobTitle"
                        value={form.jobTitle}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="e.g. AC Technician, Electrician, Plumber..."
                      />
                      {errors.jobTitle && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.jobTitle}
                        </p>
                      )}
                    </div>

                    {/* CV Upload */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Upload CV / Resume *
                      </label>
                      <div
                        onClick={() => fileRef.current?.click()}
                        className={`relative flex flex-col items-center justify-center gap-2 w-full min-h-[110px] rounded-md border-2 border-dashed cursor-pointer transition-colors ${
                          errors.cv
                            ? "border-destructive bg-destructive/5"
                            : cvFile
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/60 hover:bg-accent/5"
                        }`}
                      >
                        <input
                          ref={fileRef}
                          type="file"
                          accept={ACCEPTED_EXTENSIONS}
                          onChange={handleFile}
                          className="sr-only"
                        />
                        {cvFile ? (
                          <>
                            <FileText className="w-8 h-8 text-accent" />
                            <p className="text-sm font-medium text-foreground text-center px-4 break-all">
                              {cvFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(cvFile.size / 1024 / 1024).toFixed(2)} MB — click to change
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground text-center px-4">
                              Click to upload your CV
                            </p>
                            <p className="text-xs text-muted-foreground">
                              JPG, PNG, PDF, DOC, DOCX, PPT, PPTX — max {MAX_FILE_MB} MB
                            </p>
                          </>
                        )}
                      </div>
                      {errors.cv && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.cv}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Cover Letter / Message *
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={4}
                        className={inputClass}
                        placeholder="Tell us about yourself, your experience, and why you'd like to join our team..."
                      />
                      {errors.message && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md bg-accent text-accent-foreground font-semibold hover:brightness-110 transition-all shadow-gold disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      {loading ? "Submitting..." : "Submit Application"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CareerModal;
