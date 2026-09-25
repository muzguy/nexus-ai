export interface ValuePillar {
  title: string;
  badge: string;
  description: string;
  proofPoint: string;
}

export interface LandingPageHero {
  announcementPill: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  valuePillars: ValuePillar[];
}

export interface SocialLaunchContent {
  xTwitterThread: string[];
  linkedInPost: string;
  productHuntCard: {
    name: string;
    tagline: string; // Under 60 chars
    firstComment: string;
  };
}

export interface LaunchPositioning {
  positioningStatement: string;
  targetAudienceSummary: string;
  corePromise: string;
  differentiatorRationale: string;
}

export interface CoreLaunchMessage {
  primaryHeadline: string;
  supportingStatement: string;
  primaryCta: string;
  elevatorPitch: string;
  launchAnnouncement: string;
}

export interface AudienceAngle {
  segment: string;
  angle: string;
  tailoredHook: string;
}

export interface LaunchChannel {
  id: string;
  name: string;
  priority: 'primary' | 'secondary' | 'experimental';
  purpose: string;
  fitRationale: string;
  suggestedFormat: string;
  recommendedAction: string;
}

export interface LaunchContentPack {
  launchAnnouncement: string;
  socialPost: string;
  homepageHero: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  founderLetter: string;
  communityPost: string;
}

export interface LaunchSequencePhase {
  phase: 'pre_launch' | 'launch_day' | 'post_launch';
  title: string;
  timing: string;
  action: string;
  purpose: string;
  suggestedContent: string;
  successSignal: string;
}

export interface FirstWeekDayPlan {
  day: string; // e.g. "Day 1", "Day 2-3", "Day 4-5", "Day 6-7"
  focus: string;
  action: string;
  targetOutcome: string;
}

export interface SuccessSignal {
  metric: string;
  target: string;
  whyItMatters: string;
}

export interface LaunchKit {
  oneLinePitch: string;
  elevatorPitch: string;
  landingPage: LandingPageHero;
  socialLaunch: SocialLaunchContent;
  pressSnippet: string;
  launchChecklist: Array<{ item: string; done: boolean; category: string }>;

  // Extended structured intelligence
  launchPositioning?: LaunchPositioning;
  coreMessage?: CoreLaunchMessage;
  audienceAngles?: AudienceAngle[];
  launchChannels?: LaunchChannel[];
  launchContent?: LaunchContentPack;
  launchSequence?: LaunchSequencePhase[];
  firstWeekPlan?: FirstWeekDayPlan[];
  successSignals?: SuccessSignal[];
}
