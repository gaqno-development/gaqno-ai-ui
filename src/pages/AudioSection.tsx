import { lazy } from "react";
import {
  Volume2Icon,
  ShieldCheck,
  BookIcon,
} from "@gaqno-development/frontcore/components/icons";
import { Mic, Music, Mic2, Wand2 } from "lucide-react";
import { SectionWithSubNav } from "@gaqno-development/frontcore/components/SectionWithSubNav";

const TtsTab = lazy(() =>
  import("@/components/AudioCreationPanel/tabs/TtsTab").then((m) => ({
    default: m.TtsTab,
  }))
);
const SttTab = lazy(() =>
  import("@/components/AudioCreationPanel/tabs/SttTab").then((m) => ({
    default: m.SttTab,
  }))
);
const MusicTab = lazy(() =>
  import("@/components/AudioCreationPanel/tabs/MusicTab").then((m) => ({
    default: m.MusicTab,
  }))
);
const VoiceChangerTab = lazy(() =>
  import("@/components/AudioCreationPanel/tabs/VoiceChangerTab").then((m) => ({
    default: m.VoiceChangerTab,
  }))
);
const SoundEffectsTab = lazy(() =>
  import("@/components/AudioCreationPanel/tabs/SoundEffectsTab").then((m) => ({
    default: m.SoundEffectsTab,
  }))
);
const AudioIsolationTab = lazy(() =>
  import("@/components/AudioCreationPanel/tabs/AudioIsolationTab").then(
    (m) => ({ default: m.AudioIsolationTab })
  )
);
const PodcastTab = lazy(() =>
  import("@/components/AudioCreationPanel/tabs/PodcastTab").then((m) => ({
    default: m.PodcastTab,
  }))
);

const AUDIO_BASE = "/ai/audio";
const AUDIO_CHILDREN = [
  {
    segment: "tts",
    label: "Texto para Audio",
    href: `${AUDIO_BASE}/tts`,
    icon: Volume2Icon,
  },
  {
    segment: "stt",
    label: "Audio para Texto",
    href: `${AUDIO_BASE}/stt`,
    icon: Mic,
  },
  { segment: "music", label: "Música", href: `${AUDIO_BASE}/music`, icon: Music },
  {
    segment: "voice",
    label: "Voice Changer",
    href: `${AUDIO_BASE}/voice`,
    icon: Mic2,
  },
  { segment: "sfx", label: "Sound FX", href: `${AUDIO_BASE}/sfx`, icon: Wand2 },
  {
    segment: "isolation",
    label: "Isolar Audio",
    href: `${AUDIO_BASE}/isolation`,
    icon: ShieldCheck,
  },
  {
    segment: "podcast",
    label: "Podcast",
    href: `${AUDIO_BASE}/podcast`,
    icon: BookIcon,
  },
];

const SEGMENT_TO_COMPONENT = {
  tts: TtsTab,
  stt: SttTab,
  music: MusicTab,
  voice: VoiceChangerTab,
  sfx: SoundEffectsTab,
  isolation: AudioIsolationTab,
  podcast: PodcastTab,
};

export default function AudioSection() {
  return (
    <SectionWithSubNav
      basePath={AUDIO_BASE}
      defaultSegment="tts"
      children={AUDIO_CHILDREN}
      segmentToComponent={SEGMENT_TO_COMPONENT}
      title="Áudio"
      variant="vertical"
      breadcrumbRoot={{ label: "AI", href: "/ai/books" }}
      enableContentTransition
    />
  );
}
