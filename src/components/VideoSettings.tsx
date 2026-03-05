import React from 'react';
import { Label } from '@gaqno-development/frontcore/components/ui';
import { Switch } from '@gaqno-development/frontcore/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@gaqno-development/frontcore/components/ui';

interface VideoSettingsProps {
  addAudio: boolean;
  addVoice: boolean;
  onAddAudioChange: (value: boolean) => void;
  onAddVoiceChange: (value: boolean) => void;
  className?: string;
  compact?: boolean;
}

export const VideoSettings: React.FC<VideoSettingsProps> = ({
  addAudio,
  addVoice,
  onAddAudioChange,
  onAddVoiceChange,
  className,
  compact,
}) => {
  const switches = (
    <>
      <div className="flex items-center justify-between">
        <Label htmlFor="add-audio" className="text-sm font-normal">
          Áudio
        </Label>
        <Switch
          id="add-audio"
          checked={addAudio}
          onCheckedChange={onAddAudioChange}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="add-voice" className="text-sm font-normal">
          Voz
        </Label>
        <Switch
          id="add-voice"
          checked={addVoice}
          onCheckedChange={onAddVoiceChange}
        />
      </div>
    </>
  );
  return (
    <Card className={className}>
      <CardHeader className={compact ? "py-2" : undefined}>
        <CardTitle className="text-sm font-medium">Opções</CardTitle>
      </CardHeader>
      <CardContent className={compact ? "space-y-2 pt-0" : "space-y-4"}>
        {compact ? (
          <div className="flex flex-wrap gap-4">
            {switches}
          </div>
        ) : (
          switches
        )}
      </CardContent>
    </Card>
  );
};
