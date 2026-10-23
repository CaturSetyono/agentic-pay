import React from "react";
import { Github, Globe, GraduationCap, Mail, MessageSquare, ShieldCheck, Terminal, User } from "lucide-react";

export function DeveloperFooter() {
  return (
    <footer className="landing-footer-wrapper" id="developer">
      <div className="developer-profile-card">
        <div className="profile-header">
          <div className="avatar-badge">CS</div>
          <div className="profile-titles">
            <span className="profile-eyebrow">CREATOR &amp; LEAD SYSTEMS ENGINEER</span>
            <h3 className="profile-name">Catur Setyono</h3>
            <p className="profile-role">
              Autonomous Systems &amp; Full-Stack AI Engineer · College Student
            </p>
          </div>
          <div className="hackathon-tag">
            <span className="status-dot"></span>
            <span>PayPal AI Hackathon 2026 Submission</span>
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-col">
            <div className="col-label">
              <GraduationCap size={14} />
              <span>Academic Credentials</span>
            </div>
            <div className="col-content">
              <strong>Universitas Teknologi Digital Indonesia (UTDI)</strong>
              <p>Program Studi Sistem Informasi (SI) · Kelas Karyawan</p>
              <span className="mono-sub">NIM: 265611050</span>
            </div>
          </div>

          <div className="profile-col">
            <div className="col-label">
              <Terminal size={14} />
              <span>Project Architecture</span>
            </div>
            <div className="col-content">
              <strong>AgenticPay (PayMesh Protocol)</strong>
              <p>Autonomous B2B payment mesh with deterministic Node.js TDD test suites, Remotion motion graphics, and PayPal Orders v2 integration.</p>
              <span className="mono-sub">License: MIT Open Source</span>
            </div>
          </div>

          <div className="profile-col">
            <div className="col-label">
              <MessageSquare size={14} />
              <span>Contact &amp; Connect</span>
            </div>
            <div className="col-links">
              <a
                href="https://github.com/CaturSetyono"
                target="_blank"
                rel="noopener noreferrer"
                className="profile-link"
              >
                <Github size={14} />
                <span>GitHub (@CaturSetyono)</span>
              </a>
              <a
                href="https://github.com/CaturSetyono/agentic-pay"
                target="_blank"
                rel="noopener noreferrer"
                className="profile-link"
              >
                <Terminal size={14} />
                <span>Repository (agentic-pay)</span>
              </a>
              <a
                href="https://t.me/CaturSetyono"
                target="_blank"
                rel="noopener noreferrer"
                className="profile-link"
              >
                <MessageSquare size={14} />
                <span>Telegram Direct</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="global-footer-bar">
        <div className="footer-left">
          <strong>AgenticPay.</strong>
          <span>Autonomous Commerce Protocol &copy; 2026 Catur Setyono. Released under the MIT License.</span>
        </div>
        <div className="footer-right">
          <span className="footer-subtext">Built with Next.js, Node.js TDD, Remotion &amp; PayPal Orders v2 Sandbox.</span>
        </div>
      </div>
    </footer>
  );
}
