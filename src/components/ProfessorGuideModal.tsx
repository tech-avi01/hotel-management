import React, { useState } from 'react';
import {
  GraduationCap,
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  QrCode,
  Sparkles,
  CheckCircle2,
  Shield,
  Send,
  Globe,
  Terminal,
  FileText,
  Smartphone,
  Laptop
} from 'lucide-react';

interface ProfessorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfessorGuideModal: React.FC<ProfessorGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  // Detect current URL or fallback to shared cloud run URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://grandstay-hotel.web.app';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentUrl)}`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const SUBMISSION_MESSAGE = `Respected Professor,

I have completed my 2nd Year B.Tech IT Academic Project: "Grand Stay - Cloud-Native Hotel Management System" built with HTML5, CSS3, JavaScript/TypeScript, and Google Firebase Free Spark Tier (Firestore NoSQL + Authentication).

🌐 Live Hosted Web Application URL:
${currentUrl}

🔑 Pre-Configured Test Credentials:
1. Customer / Guest Account:
   - Email: rahul.sharma@example.com (or click 1-Click "Customer" button)
2. Admin / Front-Desk Manager Account:
   - Email: admin@grandstay.com (or click 1-Click "Admin" button)

📌 Key Evaluation Highlights:
1. Real-time room availability calculation & mathematical double-booking prevention.
2. Complete Admin Operations Dashboard with real-time revenue, check-in schedules, and room inventory CRUD.
3. Printable GST Tax Invoice generation (@media print).
4. Granular Firestore Security Rules enforcing Role-Based Access Control (RBAC).
5. Built-in "College Viva & Project Hub" with full architecture diagram, ER descriptions, and 10 viva Q&As.

Thank you!
Student Name: Avinash Tiwari
B.Tech IT (2nd Year)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/40 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Evaluator Portal
                </span>
                <span className="text-xs text-slate-400">College Submission</span>
              </div>
              <h2 className="text-lg font-serif font-bold text-white mt-0.5">
                Professor Evaluation Guide & Live Website URL
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs sm:text-sm">
          
          {/* Section 1: Live URL Generator & Share Card */}
          <div className="bg-gradient-to-br from-slate-900 to-amber-950/20 rounded-2xl border border-amber-500/30 p-5 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-6">
              
              {/* QR Code for Mobile Scanning */}
              <div className="bg-white p-3 rounded-xl shadow-md text-center shrink-0">
                <img
                  src={qrUrl}
                  alt="Live Web App QR Code"
                  className="w-36 h-36 mx-auto rounded"
                />
                <p className="text-[10px] text-slate-600 font-bold mt-1.5 flex items-center justify-center gap-1">
                  <Smartphone className="w-3 h-3 text-amber-600" /> Scan with Phone
                </p>
              </div>

              {/* URL Box & One-Click Copy */}
              <div className="flex-1 space-y-3 w-full">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
                    Official Live URL to Submit to Professor
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    Shareable Website Link
                  </h3>
                  <p className="text-xs text-slate-400">
                    Your professor or evaluator can open this link on any laptop, tablet, or mobile phone without installing any software.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-700">
                  <Globe className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="bg-transparent text-amber-300 text-xs font-mono w-full focus:outline-none select-all"
                  />
                  <button
                    onClick={() => copyToClipboard(currentUrl, 'liveUrl')}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow"
                  >
                    {copiedKey === 'liveUrl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'liveUrl' ? 'Copied!' : 'Copy URL'}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => copyToClipboard(SUBMISSION_MESSAGE, 'emailTemplate')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedKey === 'emailTemplate' ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                    {copiedKey === 'emailTemplate' ? 'Copied Message!' : 'Copy Submission Email / WhatsApp Format'}
                  </button>
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open in New Tab
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Professor 5-Step Evaluation Rubric & Demo Walkthrough */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> 5-Step Professor Evaluation Walkthrough
            </h3>
            <p className="text-xs text-slate-400">
              Guide your professor through these 5 interactive checkpoints during your college viva demonstration:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[11px]">1</span>
                  <h4 className="font-bold text-white">Guest Room Catalog & Filters</h4>
                </div>
                <p className="text-slate-400 pl-7 text-[11px] leading-relaxed">
                  Show the professor the 10 luxury rooms. Adjust the check-in/out dates, price range slider ($80–$500), and amenity pills (Jacuzzi, Balcony, Wi-Fi) to demonstrate instant filtering.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[11px]">2</span>
                  <h4 className="font-bold text-white">Double-Booking Collision Check</h4>
                </div>
                <p className="text-slate-400 pl-7 text-[11px] leading-relaxed">
                  Click &quot;Book Room&quot; on Room #201 for overlapping dates. The system immediately displays an alert explaining that dates collide with an existing reservation using the interval intersection algorithm.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[11px]">3</span>
                  <h4 className="font-bold text-white">Printable GST Tax Invoice Folio</h4>
                </div>
                <p className="text-slate-400 pl-7 text-[11px] leading-relaxed">
                  Go to &quot;My Bookings&quot; or Admin panel and click <strong>&quot;View Invoice&quot;</strong>. Show the official hotel tax folio with hotel address, GSTIN, and itemized calculations. Click <strong>Print</strong> to demonstrate print-ready formatting.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[11px]">4</span>
                  <h4 className="font-bold text-white">Admin Operations Dashboard</h4>
                </div>
                <p className="text-slate-400 pl-7 text-[11px] leading-relaxed">
                  Switch role to <strong>Admin</strong> using the 1-click toggle. Show the live KPI statistics (Total Rooms, Occupancy Rate %, Today&apos;s Check-ins, Revenue), add a new room, and toggle maintenance status.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5 md:col-span-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center text-[11px]">5</span>
                  <h4 className="font-bold text-white">Viva & Project Documentation Hub</h4>
                </div>
                <p className="text-slate-400 pl-7 text-[11px] leading-relaxed">
                  Open the purple &quot;Viva &amp; Project Hub&quot;. Show the examiner the Firestore document schemas, ER relationship table, <code>firestore.rules</code> file, and the 10 likely viva questions.
                </p>
              </div>

            </div>
          </div>

          {/* Section 3: Permanent Free Hosting & Custom Domain Guide */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" /> Permanent Custom Domain Hosting via Firebase CLI
              </h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                Free Spark Tier • Free SSL
              </span>
            </div>

            {/* Step-by-Step Cards */}
            <div className="space-y-3">
              
              {/* Step 1 */}
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[11px]">1</span>
                    <h4 className="font-bold text-white">Install Node.js & Firebase CLI Globally</h4>
                  </div>
                  <button
                    onClick={() => copyToClipboard('npm install -g firebase-tools', 'cliInstall')}
                    className="text-amber-400 hover:text-amber-300 font-mono text-[10px] flex items-center gap-1"
                  >
                    {copiedKey === 'cliInstall' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
                <p className="text-slate-400 pl-7 text-[11px]">
                  Open your terminal / command prompt on your laptop and install the Google Firebase command-line tools:
                </p>
                <pre className="bg-slate-950 p-2.5 rounded-lg text-emerald-400 font-mono text-[11px] ml-7 overflow-x-auto">
npm install -g firebase-tools
                </pre>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[11px]">2</span>
                    <h4 className="font-bold text-white">Login & Link Your Firebase Project</h4>
                  </div>
                  <button
                    onClick={() => copyToClipboard('firebase login\nfirebase init hosting', 'cliLogin')}
                    className="text-amber-400 hover:text-amber-300 font-mono text-[10px] flex items-center gap-1"
                  >
                    {copiedKey === 'cliLogin' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
                <p className="text-slate-400 pl-7 text-[11px]">
                  Sign in with your Google account and initialize hosting in your project directory:
                </p>
                <pre className="bg-slate-950 p-2.5 rounded-lg text-slate-300 font-mono text-[11px] ml-7 overflow-x-auto">
{`firebase login
firebase init hosting

# Interactive prompts:
# ? Please select an option: "Use an existing project" -> select your project
# ? What do you want to use as your public directory? "dist"
# ? Configure as a single-page app (rewrite all urls to /index.html)? "Yes"
# ? Set up automatic builds and deploys with GitHub? "No"`}
                </pre>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[11px]">3</span>
                    <h4 className="font-bold text-white">Build & Deploy Live to Google CDN</h4>
                  </div>
                  <button
                    onClick={() => copyToClipboard('npm run build\nfirebase deploy --only hosting', 'cliDeploy')}
                    className="text-amber-400 hover:text-amber-300 font-mono text-[10px] flex items-center gap-1"
                  >
                    {copiedKey === 'cliDeploy' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
                <p className="text-slate-400 pl-7 text-[11px]">
                  Build the optimized production files and upload them to Firebase&apos;s global CDN edge servers:
                </p>
                <pre className="bg-slate-950 p-2.5 rounded-lg text-amber-300 font-mono text-[11px] ml-7 overflow-x-auto">
{`npm run build
firebase deploy --only hosting`}
                </pre>
                <p className="text-[11px] text-emerald-400 font-medium pl-7">
                  ✓ Instant Live URLs created: <code>https://&lt;your-project-id&gt;.web.app</code> and <code>https://&lt;your-project-id&gt;.firebaseapp.com</code>
                </p>
              </div>

              {/* Step 4: Custom Domain Connection */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-800 to-slate-800 border border-amber-500/40 text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[11px]">4</span>
                  <h4 className="font-bold text-white">Connect Your Custom Domain (e.g. hotelgrandstay.com)</h4>
                </div>
                <div className="pl-7 text-[11px] text-slate-300 space-y-2 leading-relaxed">
                  <p>
                    1. Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-amber-400 underline font-semibold">Firebase Console</a> → Click <strong>Build</strong> → <strong>Hosting</strong>.
                  </p>
                  <p>
                    2. Click the <strong>&quot;Add custom domain&quot;</strong> button at the top of the dashboard.
                  </p>
                  <p>
                    3. Enter your domain name (e.g., <code>hotelgrandstay.com</code> or subdomain <code>hotel.yourdomain.com</code>). Check <em>&quot;Redirect to www&quot;</em> if desired, and click <strong>Continue</strong>.
                  </p>
                  <p>
                    4. Firebase will provide 2 Google IP addresses (A records) and a TXT verification record:
                  </p>

                  {/* DNS Record Table */}
                  <div className="border border-slate-700 rounded-lg overflow-hidden my-2">
                    <table className="w-full text-left font-mono text-[10px]">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr>
                          <th className="p-2">Record Type</th>
                          <th className="p-2">Host / Name</th>
                          <th className="p-2">Value / Points To (Google IP)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-900/90 text-slate-200">
                        <tr>
                          <td className="p-2 font-bold text-amber-400">A</td>
                          <td className="p-2">@ (or root)</td>
                          <td className="p-2 text-emerald-400">199.36.158.100</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold text-amber-400">A</td>
                          <td className="p-2">@ (or root)</td>
                          <td className="p-2 text-emerald-400">199.36.158.100 (Secondary)</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold text-blue-400">CNAME</td>
                          <td className="p-2">www (for subdomain)</td>
                          <td className="p-2 text-slate-300">&lt;project-id&gt;.web.app</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p>
                    5. Login to your domain registrar (GoDaddy, Namecheap, Cloudflare, Hostinger, Google Domains, etc.), open the <strong>DNS Records Management</strong> tab, and paste the A records.
                  </p>
                  <p className="text-amber-300 font-semibold flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> Free Automated SSL/TLS Certificate:
                  </p>
                  <p className="text-slate-400 text-[10px]">
                    Firebase automatically provisions a free, auto-renewing Let&apos;s Encrypt SSL certificate within 1 to 24 hours (usually 15 minutes). Your custom domain will have a green HTTPS padlock icon!
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Section 4: Email / WhatsApp Message Preview */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" /> Submission Message Preview (Ready to Send)
              </span>
              <button
                onClick={() => copyToClipboard(SUBMISSION_MESSAGE, 'previewCopy')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                {copiedKey === 'previewCopy' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedKey === 'previewCopy' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="bg-slate-900 p-3 rounded-lg text-[11px] font-mono text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
              {SUBMISSION_MESSAGE}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400">Share this modal during college lab presentation</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
