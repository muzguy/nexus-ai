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

export interface LaunchKit {
  oneLinePitch: string;
  elevatorPitch: string;
  landingPage: LandingPageHero;
  socialLaunch: SocialLaunchContent;
  pressSnippet: string;
  launchChecklist: Array<{ item: string; done: boolean; category: string }>;
}
