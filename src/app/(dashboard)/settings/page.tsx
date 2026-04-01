"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PageTransition } from "@/components/layout/page-transition";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TestStatus = "idle" | "loading" | "success" | "error";

export default function SettingsPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // T212 settings
  const [apiKey, setApiKey] = useState("");
  const [environment, setEnvironment] = useState<"live" | "demo">("live");
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Test connection
  const [testStatus, setTestStatus] = useState<TestStatus>("idle");
  const [testMessage, setTestMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const res = await fetch("/api/settings/t212", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: apiKey.trim(), environment }),
    });

    if (res.ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      const data = await res.json();
      setSaveError(data.error ?? "Failed to save");
    }
    setSaving(false);
  };

  const handleTest = async () => {
    setTestStatus("loading");
    setTestMessage(null);

    const res = await fetch("/api/portfolio/account");
    if (res.ok) {
      const data = await res.json();
      setTestStatus("success");
      setTestMessage(`Connected — ${data.currencyCode} account, cash: ${data.cash?.toLocaleString()}`);
    } else {
      const data = await res.json();
      setTestStatus("error");
      setTestMessage(data.error ?? "Connection failed");
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <PageTransition>
      <>
        <Header title="Settings" />
        <div className="p-4 md:p-6 space-y-6 max-w-2xl">

          {/* T212 Connection */}
          <Card>
            <CardHeader>
              <CardTitle>Trading 212 Connection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste your T212 API key"
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Generate your API key in the T212 app under Settings → API.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Account type
                </label>
                <div className="flex gap-2">
                  {(["live", "demo"] as const).map((env) => (
                    <button
                      key={env}
                      onClick={() => setEnvironment(env)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${
                        environment === env
                          ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                          : "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      {env}
                    </button>
                  ))}
                </div>
              </div>

              {/* Test connection result */}
              {testStatus !== "idle" && testMessage && (
                <div className={`flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm ${
                  testStatus === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : testStatus === "error"
                    ? "bg-destructive/10 border border-destructive/20 text-destructive"
                    : "bg-muted/50 border border-border text-muted-foreground"
                }`}>
                  {testStatus === "success" && <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />}
                  {testStatus === "error" && <XCircle className="h-4 w-4 shrink-0 mt-0.5" />}
                  {testStatus === "loading" && <Loader2 className="h-4 w-4 shrink-0 mt-0.5 animate-spin" />}
                  <span>{testMessage}</span>
                </div>
              )}

              {saveError && (
                <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                  {saveError}
                </p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleTest}
                  disabled={testStatus === "loading"}
                  className="flex-1 border border-border rounded-xl py-2.5 text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all disabled:opacity-50"
                >
                  {testStatus === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Testing…
                    </span>
                  ) : "Test connection"}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !apiKey.trim()}
                  className="flex-1 gradient-primary text-white rounded-xl py-2.5 text-sm font-medium shadow-md shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
                    </span>
                  ) : saveSuccess ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5" /> Saved
                    </span>
                  ) : "Save"}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Account */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userEmail && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Signed in as</p>
                  <p className="text-sm font-medium text-foreground">{userEmail}</p>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="w-full border border-border rounded-xl py-2.5 text-sm font-medium text-muted-foreground hover:border-destructive/40 hover:text-destructive transition-all"
              >
                Sign out
              </button>
            </CardContent>
          </Card>

        </div>
      </>
    </PageTransition>
  );
}
