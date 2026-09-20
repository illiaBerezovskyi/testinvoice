"use client";

import type { TemplateSettings } from "@/lib/types";
import { Field } from "@/components/ui/Field";
import { TextArea, TextInput } from "@/components/ui/TextInput";
import { Toggle } from "@/components/ui/Toggle";
import { Section } from "./Section";

type Props = {
  settings: TemplateSettings;
  update: (patch: Partial<TemplateSettings>) => void;
};

export function ContentTab({ settings, update }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <Section title="Header" description="Text shown at the very top of the document.">
        <Field label="Document title" htmlFor="heading-label">
          <TextInput
            id="heading-label"
            value={settings.headingLabel}
            maxLength={24}
            placeholder="Invoice"
            onChange={(e) => update({ headingLabel: e.target.value })}
          />
        </Field>
      </Section>

      <Section title="Line items">
        <Toggle
          id="show-description"
          label="Show item descriptions"
          description="Hide to keep the table compact."
          checked={settings.showDescription}
          onChange={(showDescription) => update({ showDescription })}
        />
      </Section>

      <Section title="Footer" description="Legal notes and a closing message for your customer.">
        <Toggle
          id="show-terms"
          label="Terms & conditions"
          checked={settings.showTerms}
          onChange={(showTerms) => update({ showTerms })}
        />
        <Field label="Terms text" htmlFor="terms">
          <TextArea
            id="terms"
            value={settings.terms}
            disabled={!settings.showTerms}
            maxLength={400}
            onChange={(e) => update({ terms: e.target.value })}
            className="disabled:opacity-50"
          />
        </Field>

        <Toggle
          id="show-statement"
          label="Closing statement"
          checked={settings.showStatement}
          onChange={(showStatement) => update({ showStatement })}
        />
        <Field label="Statement text" htmlFor="statement">
          <TextArea
            id="statement"
            value={settings.statement}
            disabled={!settings.showStatement}
            maxLength={300}
            onChange={(e) => update({ statement: e.target.value })}
            className="disabled:opacity-50"
          />
        </Field>
      </Section>
    </div>
  );
}
