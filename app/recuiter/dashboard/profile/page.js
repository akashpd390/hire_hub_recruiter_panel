"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, CheckCircle2, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organisation: "",
    location: "",
    organisation_desc: "",
  });

  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        if (isMounted) setLoading(false);
        return;
      }

      if (isMounted) setUser(data.user);

      // Fetch existing profile data
      const { data: profileData, error: profileError } = await supabase
        .from("recuiters")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileData && isMounted) {
        setFormData({
          name: profileData.name || "",
          email: profileData.email || data.user.email || "",
          organisation: profileData.organisation || "",
          location: profileData.location || "",
          organisation_desc: profileData.organisation_desc || "",
        });
      }
      if (isMounted) setLoading(false);
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(false); // hide success msg on edit
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSuccess(false);

    const { error } = await supabase
      .from("recuiters")
      .upsert(
        {
          id: user.id,
          name: formData.name,
          email: formData.email,
          organisation: formData.organisation,
          location: formData.location,
          organisation_desc: formData.organisation_desc,
        },
        { onConflict: "id" }
      );

    setSaving(false);
    if (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } else {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoaderCircle className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Profile Settings
        </h1>
        <p className="text-zinc-500 mt-2">
          Update your personal information and organization details.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-8 md:p-10">
          <form onSubmit={handleSave} className="space-y-8">
            {/* Contact Info Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <UserCircle2 className="w-5 h-5 text-indigo-500" />
                <h2 className="text-xl font-semibold text-zinc-800">
                  Contact Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">
                    Full Name
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Jane Doe"
                    className="focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">
                    Email Address
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    className="bg-zinc-50 text-zinc-500 cursor-not-allowed hidden"
                  />
                  <div className="px-3 py-2 border rounded-md bg-zinc-50 text-zinc-500 text-sm">
                    {formData.email || "No email provided"}
                  </div>
                  <p className="text-xs text-zinc-400">
                    Your authenticated email address cannot be changed here.
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-zinc-100" />

            {/* Organization Info Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold text-zinc-800">
                  Organization Details
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">
                    Organization Name
                  </label>
                  <Input
                    name="organisation"
                    value={formData.organisation}
                    onChange={handleChange}
                    placeholder="e.g. Acme Corp"
                    className="focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">
                    Location
                  </label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. New York, NY"
                    className="focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-700">
                    Organization Description
                  </label>
                  <Textarea
                    name="organisation_desc"
                    value={formData.organisation_desc}
                    onChange={handleChange}
                    placeholder="Tell applicants what makes your organization special..."
                    className="min-h-[120px] focus-visible:ring-indigo-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px] rounded-xl shadow-sm transition-all"
              >
                {saving ? (
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>

              {success && (
                <div className="flex items-center gap-2 text-emerald-600 animate-in fade-in slide-in-from-left-4">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Profile updated successfully</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
