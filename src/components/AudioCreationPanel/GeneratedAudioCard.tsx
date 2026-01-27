import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@gaqno-development/frontcore/components/ui';

interface GeneratedAudioCardProps {
  audioUrl: string;
  title: string;
  extra?: ReactNode;
}

export function GeneratedAudioCard({ audioUrl, title, extra }: GeneratedAudioCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className={extra ? 'space-y-2' : undefined}>
        <audio controls className="w-full">
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        {extra}
      </CardContent>
    </Card>
  );
}
