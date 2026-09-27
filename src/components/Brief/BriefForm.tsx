"use client";

import { useRef, useState, type SubmitEvent } from "react";
import Button from "@/components/Button";
import type { SanityPreBriefQuestion } from "./types";
import styles from "./Brief.module.css";

type Status = "idle" | "submitting" | "success" | "error";

interface BriefFormProps {
  questions: SanityPreBriefQuestion[];
}

const PLACEHOLDER = "Your answer";

export default function BriefForm({ questions }: BriefFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // Keyed by question key. Single-value fields hold a string; multiSelect
  // holds an array, so both shapes can live in one map.
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const setAnswer = (key: string, value: string | string[]) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const toggleMulti = (key: string, option: string) =>
    setAnswers((prev) => {
      const current = Array.isArray(prev[key]) ? (prev[key] as string[]) : [];
      return {
        ...prev,
        [key]: current.includes(option)
          ? current.filter((v) => v !== option)
          : [...current, option],
      };
    });

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, answers }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setAnswers({});
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const disabled = status === "submitting";

  const renderField = (q: SanityPreBriefQuestion) => {
    const value = answers[q.key];
    const stringValue = typeof value === "string" ? value : "";

    switch (q.fieldType) {
      case "longText":
        return (
          <textarea
            id={q.key}
            name={q.key}
            rows={3}
            className={`${styles.input} ${styles.textarea}`}
            placeholder={q.helperText || PLACEHOLDER}
            required={q.required}
            disabled={disabled}
            value={stringValue}
            onChange={(e) => setAnswer(q.key, e.target.value)}
          />
        );

      case "singleSelect":
        return (
          <div className={styles.options} role="radiogroup" aria-labelledby={`${q.key}-label`}>
            {(q.options ?? []).map((option) => (
              <label key={option} className={styles.option}>
                <input
                  type="radio"
                  name={q.key}
                  value={option}
                  required={q.required}
                  disabled={disabled}
                  checked={stringValue === option}
                  onChange={() => setAnswer(q.key, option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case "multiSelect": {
        const selected = Array.isArray(value) ? value : [];
        return (
          <div className={styles.options} role="group" aria-labelledby={`${q.key}-label`}>
            {(q.options ?? []).map((option) => (
              <label key={option} className={styles.option}>
                <input
                  type="checkbox"
                  name={q.key}
                  value={option}
                  disabled={disabled}
                  checked={selected.includes(option)}
                  onChange={() => toggleMulti(q.key, option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      }

      default:
        return (
          <input
            id={q.key}
            name={q.key}
            type={q.fieldType === "email" ? "email" : q.fieldType === "phone" ? "tel" : "text"}
            className={styles.input}
            placeholder={q.helperText || PLACEHOLDER}
            required={q.required}
            disabled={disabled}
            value={stringValue}
            onChange={(e) => setAnswer(q.key, e.target.value)}
          />
        );
    }
  };

  return (
    <form className={styles.form} ref={formRef} onSubmit={handleSubmit}>
      {/* Fixed contact row — name and email sit side by side above the
          CMS-driven questions, per the design. */}
      <div className={styles.contactRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="brief-name">
            Name
          </label>
          <input
            id="brief-name"
            name="name"
            type="text"
            autoComplete="name"
            className={styles.input}
            placeholder={PLACEHOLDER}
            required
            disabled={disabled}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="brief-email">
            Email
          </label>
          <input
            id="brief-email"
            name="email"
            type="email"
            autoComplete="email"
            className={styles.input}
            placeholder={PLACEHOLDER}
            required
            disabled={disabled}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {questions.map((q) => (
        <div key={q.key} className={styles.field}>
          <label className={styles.label} id={`${q.key}-label`} htmlFor={q.key}>
            {q.label}
            {q.required && <span aria-hidden="true"> *</span>}
          </label>
          {renderField(q)}
        </div>
      ))}

      <div className={styles.submitRow}>
        <Button className={styles.submitButton} onClick={() => formRef.current?.requestSubmit()}>
          {disabled ? "Sending…" : "Submit your answers"}
        </Button>
      </div>

      {status !== "idle" && status !== "submitting" && (
        <p className={styles.status} role="status">
          {status === "success" ? "Thanks — your answers are on their way." : error}
        </p>
      )}
    </form>
  );
}
