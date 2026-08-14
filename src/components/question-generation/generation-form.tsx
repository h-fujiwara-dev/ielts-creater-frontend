"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Difficulty, Section } from "@/lib/api/enums";
import {
  generationFormSchema,
  type GenerationFormValues,
} from "@/lib/question-sets/schemas";
import { cn } from "@/lib/utils";

const SECTION_OPTIONS: { value: Section; label: string; description: string }[] = [
  { value: "READING", label: "Reading", description: "長文読解問題" },
  { value: "LISTENING", label: "Listening", description: "音声リスニング問題" },
];

const TOPIC_PRESETS = ["Environment", "Technology", "Education", "Health"];

const DIFFICULTY_OPTIONS: { value: Difficulty; band: string; level: string }[] = [
  { value: "BAND_4_5", band: "4-5", level: "初級" },
  { value: "BAND_5_6", band: "5-6", level: "中級" },
  { value: "BAND_6_7", band: "6-7", level: "中上級" },
  { value: "BAND_7_8_PLUS", band: "7-8+", level: "上級" },
];

interface GenerationFormProps {
  defaultValues?: Partial<GenerationFormValues>;
  onSubmit: (values: GenerationFormValues) => void;
}

export function GenerationForm({ defaultValues, onSubmit }: GenerationFormProps) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GenerationFormValues>({
    resolver: zodResolver(generationFormSchema),
    defaultValues: {
      section: "READING",
      topic: "Environment",
      difficulty: "BAND_6_7",
      ...defaultValues,
    },
  });

  const currentTopic = useWatch({ control, name: "topic" });

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Field>
        <FieldLabel>セクション</FieldLabel>
        <Controller
          control={control}
          name="section"
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {SECTION_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors duration-200",
                    field.value === option.value
                      ? "border-brand-navy bg-brand-lavender"
                      : "border-border hover:bg-muted"
                  )}
                >
                  <RadioGroupItem value={option.value} className="mt-1" />
                  <div>
                    <p className="font-semibold text-brand-navy">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          )}
        />
      </Field>

      <Field data-invalid={!!errors.topic}>
        <FieldLabel>トピック</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {TOPIC_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setValue("topic", preset, { shouldValidate: true })}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors duration-200",
                currentTopic === preset
                  ? "border-brand-navy bg-brand-lavender text-brand-navy"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {preset}
            </button>
          ))}
        </div>
        <Input
          placeholder="自由入力（例: リモートワークの普及について）"
          aria-invalid={!!errors.topic}
          {...register("topic")}
        />
        <p className="text-xs text-muted-foreground">
          プリセットから選択、または自由入力できます（任意）
        </p>
        <FieldError errors={errors.topic ? [errors.topic] : undefined} />
      </Field>

      <Field>
        <FieldLabel>難易度（バンドスコア帯）</FieldLabel>
        <Controller
          control={control}
          name="difficulty"
          render={({ field }) => (
            <div
              role="radiogroup"
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {DIFFICULTY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={field.value === option.value}
                  onClick={() => field.onChange(option.value)}
                  className={cn(
                    "rounded-xl border p-3 text-center transition-colors duration-200",
                    field.value === option.value
                      ? "border-brand-navy bg-brand-lavender"
                      : "border-border hover:bg-muted"
                  )}
                >
                  <p className="font-semibold text-brand-navy">Band {option.band}</p>
                  <p className="text-xs text-muted-foreground">{option.level}</p>
                </button>
              ))}
            </div>
          )}
        />
      </Field>

      <Button type="submit" size="lg" className="mt-2 h-11 w-full rounded-full">
        問題を生成する
      </Button>
    </form>
  );
}
