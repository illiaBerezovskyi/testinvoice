"use client";

import type { TemplateSettings } from "@/lib/types";
import { Field } from "@/components/ui/Field";
import { TextInput } from "@/components/ui/TextInput";
import { Toggle } from "@/components/ui/Toggle";
import { Segmented } from "@/components/ui/Segmented";
import { ColorField } from "./ColorField";
import { ColorPresets } from "./ColorPresets";
import { LogoUpload } from "./LogoUpload";
import { Section } from "./Section";

type Props = {
  settings: TemplateSettings;
  update: (patch: Partial<TemplateSettings>) => void;
};

export function GeneralTab({ settings, update }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <Section
        title="Template"
        description="Give this template a name so you can pick it when creating invoices."
      >
        <Field label="Template name" htmlFor="template-name" required>
          <TextInput
            id="template-name"
            value={settings.name}
            maxLength={48}
            placeholder="e.g. Standard Template"
            onChange={(e) => update({ name: e.target.value })}
          />
        </Field>
      </Section>

      <Section
        title="Brand colors"
        description="Primary is used for headings and emphasis, secondary for supporting accents."
      >
        <ColorPresets
          primary={settings.primaryColor}
          secondary={settings.secondaryColor}
          onPick={(primaryColor, secondaryColor) => update({ primaryColor, secondaryColor })}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ColorField
            label="Primary color"
            value={settings.primaryColor}
            onChange={(primaryColor) => update({ primaryColor })}
          />
          <ColorField
            label="Secondary color"
            value={settings.secondaryColor}
            onChange={(secondaryColor) => update({ secondaryColor })}
          />
        </div>
      </Section>

      <Section title="Logo" description="Shown in the invoice header next to the title.">
        <Toggle
          id="show-logo"
          label="Display company logo"
          checked={settings.showLogo}
          onChange={(showLogo) => update({ showLogo })}
        />
        <LogoUpload
          value={settings.logoDataUrl}
          onChange={(logoDataUrl) => update({ logoDataUrl })}
          disabled={!settings.showLogo}
        />
        <Field label="Logo placement">
          <Segmented
            ariaLabel="Logo placement"
            value={settings.logoPosition}
            onChange={(logoPosition) => update({ logoPosition })}
            options={[
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
            ]}
          />
        </Field>
      </Section>
    </div>
  );
}
