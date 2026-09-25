import {
  LaunchKit,
  LandingPageHero,
  SocialLaunchContent,
  ValuePillar,
  LaunchPositioning,
  CoreLaunchMessage,
  AudienceAngle,
  LaunchChannel,
  LaunchContentPack,
  LaunchSequencePhase,
  FirstWeekDayPlan,
  SuccessSignal,
} from '@/types/launch';

export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  error?: string;
}

const VALID_PRIORITIES = new Set(['primary', 'secondary', 'experimental']);
const VALID_PHASES = new Set(['pre_launch', 'launch_day', 'post_launch']);

/**
 * Validates and sanitizes a raw Gemini JSON response for the Launch Kit stage.
 * Ensures all required landing page elements, pitches, social campaigns,
 * channels, sequences, and success signals conform to strict TypeScript interfaces.
 */
export function validateAndSanitizeLaunchData(raw: unknown): ValidationResult<LaunchKit> {
  if (!raw || typeof raw !== 'object') {
    return {
      isValid: false,
      error: 'Launch kit response is empty or not a valid JSON object.',
    };
  }

  const obj = raw as Record<string, unknown>;

  // 1. One-Line Pitch & Elevator Pitch
  const oneLinePitch =
    typeof obj.oneLinePitch === 'string' && obj.oneLinePitch.trim().length > 0
      ? obj.oneLinePitch.trim()
      : 'Launch-ready product intelligence co-pilot.';

  const elevatorPitch =
    typeof obj.elevatorPitch === 'string' && obj.elevatorPitch.trim().length > 0
      ? obj.elevatorPitch.trim()
      : 'An engineered intelligence workspace designed to transform strategic brand foundations into immediate go-to-market execution.';

  const pressSnippet =
    typeof obj.pressSnippet === 'string' && obj.pressSnippet.trim().length > 0
      ? obj.pressSnippet.trim()
      : 'Announcing the launch of a new strategic brand intelligence platform built for modern high-conviction teams.';

  // 2. Landing Page Hero
  const rawLanding = obj.landingPage && typeof obj.landingPage === 'object' ? (obj.landingPage as Record<string, unknown>) : {};
  const headline =
    typeof rawLanding.headline === 'string' && rawLanding.headline.trim().length > 0
      ? rawLanding.headline.trim()
      : oneLinePitch;

  const subheadline =
    typeof rawLanding.subheadline === 'string' && rawLanding.subheadline.trim().length > 0
      ? rawLanding.subheadline.trim()
      : elevatorPitch;

  const announcementPill =
    typeof rawLanding.announcementPill === 'string' && rawLanding.announcementPill.trim().length > 0
      ? rawLanding.announcementPill.trim()
      : 'System Live';

  const primaryCta =
    typeof rawLanding.primaryCta === 'string' && rawLanding.primaryCta.trim().length > 0
      ? rawLanding.primaryCta.trim()
      : 'Get Started';

  const secondaryCta =
    typeof rawLanding.secondaryCta === 'string' && rawLanding.secondaryCta.trim().length > 0
      ? rawLanding.secondaryCta.trim()
      : 'View Architecture';

  const rawPillars = Array.isArray(rawLanding.valuePillars) ? rawLanding.valuePillars : [];
  const valuePillars: ValuePillar[] = [];

  rawPillars.forEach((p, idx) => {
    if (!p || typeof p !== 'object') return;
    const item = p as Record<string, unknown>;
    const pTitle = typeof item.title === 'string' && item.title.trim() ? item.title.trim() : `Pillar 0${idx + 1}`;
    const pBadge = typeof item.badge === 'string' && item.badge.trim() ? item.badge.trim() : 'Core Advantage';
    const pDesc = typeof item.description === 'string' && item.description.trim() ? item.description.trim() : 'Engineered for reliability and defensibility.';
    const pProof = typeof item.proofPoint === 'string' && item.proofPoint.trim() ? item.proofPoint.trim() : 'Verified by strategic benchmarks.';

    valuePillars.push({
      title: pTitle,
      badge: pBadge,
      description: pDesc,
      proofPoint: pProof,
    });
  });

  if (valuePillars.length === 0) {
    valuePillars.push(
      {
        title: 'Calibrated Precision',
        badge: 'Verified',
        description: 'Deeply aligned with core audience needs and institutional curriculum.',
        proofPoint: '100% adherence to domain requirements.',
      },
      {
        title: 'Sovereign Focus',
        badge: 'Distraction-Free',
        description: 'Eliminates viral gimmicks and superficial noise in favor of pure performance.',
        proofPoint: 'Zero frivolous add-ons.',
      }
    );
  }

  const landingPage: LandingPageHero = {
    announcementPill,
    headline,
    subheadline,
    primaryCta,
    secondaryCta,
    valuePillars,
  };

  // 3. Social Launch
  const rawSocial = obj.socialLaunch && typeof obj.socialLaunch === 'object' ? (obj.socialLaunch as Record<string, unknown>) : {};
  const rawTweets = Array.isArray(rawSocial.xTwitterThread) ? rawSocial.xTwitterThread : [];
  const xTwitterThread: string[] = rawTweets
    .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
    .map((t) => t.trim());

  if (xTwitterThread.length === 0) {
    xTwitterThread.push(
      `1/ Introducing ${headline}. Built from the ground up for focused execution.`,
      `2/ Why now? Conventional generic tools fail to address the specific nuances of this problem domain.`,
      `3/ Try it today: ${primaryCta}.`
    );
  }

  const linkedInPost =
    typeof rawSocial.linkedInPost === 'string' && rawSocial.linkedInPost.trim().length > 0
      ? rawSocial.linkedInPost.trim()
      : `${headline}\n\nToday marks an important milestone as we officially launch. We engineered this platform to bring uncompromising focus to our target audience.\n\nExplore more today.`;

  const rawPh = rawSocial.productHuntCard && typeof rawSocial.productHuntCard === 'object' ? (rawSocial.productHuntCard as Record<string, unknown>) : {};
  const phName = typeof rawPh.name === 'string' && rawPh.name.trim() ? rawPh.name.trim() : 'Launch Product';
  let phTagline = typeof rawPh.tagline === 'string' && rawPh.tagline.trim() ? rawPh.tagline.trim() : oneLinePitch;
  if (phTagline.length > 60) {
    phTagline = phTagline.slice(0, 57) + '...';
  }
  const phComment =
    typeof rawPh.firstComment === 'string' && rawPh.firstComment.trim()
      ? rawPh.firstComment.trim()
      : `Hey Product Hunt! Excited to share our launch today. We built this to solve core friction points for our community. Would love your feedback!`;

  const socialLaunch: SocialLaunchContent = {
    xTwitterThread,
    linkedInPost,
    productHuntCard: {
      name: phName,
      tagline: phTagline,
      firstComment: phComment,
    },
  };

  // 4. Launch Readiness Checklist
  const rawChecklist = Array.isArray(obj.launchChecklist) ? obj.launchChecklist : [];
  const launchChecklist = rawChecklist.map((c, idx) => {
    if (!c || typeof c !== 'object') {
      return { item: `Task ${idx + 1}`, done: false, category: 'Launch Operations' };
    }
    const item = c as Record<string, unknown>;
    return {
      item: typeof item.item === 'string' && item.item.trim() ? item.item.trim() : `Milestone 0${idx + 1}`,
      done: Boolean(item.done),
      category: typeof item.category === 'string' && item.category.trim() ? item.category.trim() : 'Operations',
    };
  });

  if (launchChecklist.length === 0) {
    launchChecklist.push(
      { item: 'Verify landing page copy & CTA endpoints', done: true, category: 'Production' },
      { item: 'Prepare launch announcement thread on social channels', done: false, category: 'Distribution' },
      { item: 'Set up real-time analytics for user query completion', done: false, category: 'Analytics' },
      { item: 'Distribute direct announcement to initial community cohort', done: false, category: 'Outreach' }
    );
  }

  // 5. Extended: Launch Positioning
  const rawPos = obj.launchPositioning && typeof obj.launchPositioning === 'object' ? (obj.launchPositioning as Record<string, unknown>) : {};
  const launchPositioning: LaunchPositioning = {
    positioningStatement:
      typeof rawPos.positioningStatement === 'string' && rawPos.positioningStatement.trim()
        ? rawPos.positioningStatement.trim()
        : `${headline} — ${subheadline}`,
    targetAudienceSummary:
      typeof rawPos.targetAudienceSummary === 'string' && rawPos.targetAudienceSummary.trim()
        ? rawPos.targetAudienceSummary.trim()
        : 'Target users seeking uncompromising quality and defensibility.',
    corePromise:
      typeof rawPos.corePromise === 'string' && rawPos.corePromise.trim()
        ? rawPos.corePromise.trim()
        : 'Guaranteed alignment with user requirements and zero superficial fluff.',
    differentiatorRationale:
      typeof rawPos.differentiatorRationale === 'string' && rawPos.differentiatorRationale.trim()
        ? rawPos.differentiatorRationale.trim()
        : 'Calibrated directly to domain-specific context unlike generic competitors.',
  };

  // 6. Extended: Core Launch Message
  const rawCoreMsg = obj.coreMessage && typeof obj.coreMessage === 'object' ? (obj.coreMessage as Record<string, unknown>) : {};
  const coreMessage: CoreLaunchMessage = {
    primaryHeadline:
      typeof rawCoreMsg.primaryHeadline === 'string' && rawCoreMsg.primaryHeadline.trim()
        ? rawCoreMsg.primaryHeadline.trim()
        : headline,
    supportingStatement:
      typeof rawCoreMsg.supportingStatement === 'string' && rawCoreMsg.supportingStatement.trim()
        ? rawCoreMsg.supportingStatement.trim()
        : subheadline,
    primaryCta:
      typeof rawCoreMsg.primaryCta === 'string' && rawCoreMsg.primaryCta.trim()
        ? rawCoreMsg.primaryCta.trim()
        : primaryCta,
    elevatorPitch:
      typeof rawCoreMsg.elevatorPitch === 'string' && rawCoreMsg.elevatorPitch.trim()
        ? rawCoreMsg.elevatorPitch.trim()
        : elevatorPitch,
    launchAnnouncement:
      typeof rawCoreMsg.launchAnnouncement === 'string' && rawCoreMsg.launchAnnouncement.trim()
        ? rawCoreMsg.launchAnnouncement.trim()
        : pressSnippet,
  };

  // 7. Extended: Audience Angles
  const rawAngles = Array.isArray(obj.audienceAngles) ? obj.audienceAngles : [];
  const audienceAngles: AudienceAngle[] = rawAngles.map((a, idx) => {
    const item = a && typeof a === 'object' ? (a as Record<string, unknown>) : {};
    return {
      segment: typeof item.segment === 'string' && item.segment.trim() ? item.segment.trim() : `Audience Segment 0${idx + 1}`,
      angle: typeof item.angle === 'string' && item.angle.trim() ? item.angle.trim() : 'Direct functional utility',
      tailoredHook: typeof item.tailoredHook === 'string' && item.tailoredHook.trim() ? item.tailoredHook.trim() : 'Master your workflow with precision.',
    };
  });

  // 8. Extended: Launch Channels
  const rawChannels = Array.isArray(obj.launchChannels) ? obj.launchChannels : [];
  const launchChannels: LaunchChannel[] = rawChannels.map((ch, idx) => {
    const item = ch && typeof ch === 'object' ? (ch as Record<string, unknown>) : {};
    const id = typeof item.id === 'string' && item.id.trim() ? item.id.trim() : `channel_${idx + 1}`;
    const name = typeof item.name === 'string' && item.name.trim() ? item.name.trim() : `Channel ${idx + 1}`;
    const prioStr = typeof item.priority === 'string' ? item.priority.toLowerCase().trim() : '';
    const priority: 'primary' | 'secondary' | 'experimental' = VALID_PRIORITIES.has(prioStr)
      ? (prioStr as 'primary' | 'secondary' | 'experimental')
      : idx === 0
      ? 'primary'
      : 'secondary';
    const purpose = typeof item.purpose === 'string' && item.purpose.trim() ? item.purpose.trim() : 'Targeted distribution';
    const fitRationale = typeof item.fitRationale === 'string' && item.fitRationale.trim() ? item.fitRationale.trim() : 'High audience resonance.';
    const suggestedFormat = typeof item.suggestedFormat === 'string' && item.suggestedFormat.trim() ? item.suggestedFormat.trim() : 'Long-form thread & demonstration';
    const recommendedAction = typeof item.recommendedAction === 'string' && item.recommendedAction.trim() ? item.recommendedAction.trim() : 'Publish announcement and monitor feedback.';

    return {
      id,
      name,
      priority,
      purpose,
      fitRationale,
      suggestedFormat,
      recommendedAction,
    };
  });

  if (launchChannels.length === 0) {
    launchChannels.push(
      {
        id: 'chan_direct',
        name: 'Direct Community & Campus Groups',
        priority: 'primary',
        purpose: 'Establish immediate beachhead adoption with initial target cohort.',
        fitRationale: 'High trust, zero algorithm mediation, direct word-of-mouth distribution.',
        suggestedFormat: 'Short practical demo video + direct onboarding link',
        recommendedAction: 'Share in course/department communities with clear unit syllabus benchmarks.',
      },
      {
        id: 'chan_x',
        name: 'X / Twitter Technical Thread',
        priority: 'secondary',
        purpose: 'Public launch visibility and technical validation.',
        fitRationale: 'Ideal for demonstrating engineering depth and product philosophy.',
        suggestedFormat: 'Numbered thread detailing problem, architecture, and live demo',
        recommendedAction: 'Post at peak study hours with live demo links.',
      }
    );
  }

  // 9. Extended: Launch Content Pack
  const rawPack = obj.launchContent && typeof obj.launchContent === 'object' ? (obj.launchContent as Record<string, unknown>) : {};
  const rawHeroPack = rawPack.homepageHero && typeof rawPack.homepageHero === 'object' ? (rawPack.homepageHero as Record<string, unknown>) : {};
  const launchContent: LaunchContentPack = {
    launchAnnouncement:
      typeof rawPack.launchAnnouncement === 'string' && rawPack.launchAnnouncement.trim()
        ? rawPack.launchAnnouncement.trim()
        : pressSnippet,
    socialPost:
      typeof rawPack.socialPost === 'string' && rawPack.socialPost.trim()
        ? rawPack.socialPost.trim()
        : linkedInPost,
    homepageHero: {
      headline:
        typeof rawHeroPack.headline === 'string' && rawHeroPack.headline.trim()
          ? rawHeroPack.headline.trim()
          : headline,
      subheadline:
        typeof rawHeroPack.subheadline === 'string' && rawHeroPack.subheadline.trim()
          ? rawHeroPack.subheadline.trim()
          : subheadline,
      cta:
        typeof rawHeroPack.cta === 'string' && rawHeroPack.cta.trim()
          ? rawHeroPack.cta.trim()
          : primaryCta,
    },
    founderLetter:
      typeof rawPack.founderLetter === 'string' && rawPack.founderLetter.trim()
        ? rawPack.founderLetter.trim()
        : `We started this project because generic tools consistently failed to address the specific realities of our workflow. Today, we invite you to experience a system calibrated for your actual needs.`,
    communityPost:
      typeof rawPack.communityPost === 'string' && rawPack.communityPost.trim()
        ? rawPack.communityPost.trim()
        : `Hey everyone, the first version is officially live. Built specifically for our community with zero ads or tracking. Try it out and tell us what you think!`,
  };

  // 10. Extended: Launch Sequence
  const rawSeq = Array.isArray(obj.launchSequence) ? obj.launchSequence : [];
  const launchSequence: LaunchSequencePhase[] = rawSeq.map((sq, idx) => {
    const item = sq && typeof sq === 'object' ? (sq as Record<string, unknown>) : {};
    const phaseStr = typeof item.phase === 'string' ? item.phase.toLowerCase().trim() : '';
    const phase: 'pre_launch' | 'launch_day' | 'post_launch' = VALID_PHASES.has(phaseStr)
      ? (phaseStr as 'pre_launch' | 'launch_day' | 'post_launch')
      : idx === 0
      ? 'pre_launch'
      : idx === 1
      ? 'launch_day'
      : 'post_launch';

    return {
      phase,
      title: typeof item.title === 'string' && item.title.trim() ? item.title.trim() : `Phase 0${idx + 1}`,
      timing: typeof item.timing === 'string' && item.timing.trim() ? item.timing.trim() : 'T-minus 3 Days',
      action: typeof item.action === 'string' && item.action.trim() ? item.action.trim() : 'Execute targeted outreach',
      purpose: typeof item.purpose === 'string' && item.purpose.trim() ? item.purpose.trim() : 'Prime the early audience',
      suggestedContent: typeof item.suggestedContent === 'string' && item.suggestedContent.trim() ? item.suggestedContent.trim() : 'Preview teaser & alpha signup',
      successSignal: typeof item.successSignal === 'string' && item.successSignal.trim() ? item.successSignal.trim() : 'First 100 alpha confirmations',
    };
  });

  if (launchSequence.length === 0) {
    launchSequence.push(
      {
        phase: 'pre_launch',
        title: 'Closed Beta Calibration',
        timing: 'T-Minus 4 Days',
        action: 'Onboard 50 power users to stress-test core flows and latency.',
        purpose: 'Verify syllabus accuracy and mobile Wi-Fi performance.',
        suggestedContent: 'Direct invitation to department peer groups.',
        successSignal: 'Zero critical syllabus hallucinations on unit tests.',
      },
      {
        phase: 'launch_day',
        title: 'Public Release & Campus Drop',
        timing: 'Day 0',
        action: 'Publish announcement threads and deploy live landing page.',
        purpose: 'Drive immediate organic adoption across primary channels.',
        suggestedContent: 'Live platform walkthrough and primary CTA announcement.',
        successSignal: '500+ active queries in the first 6 hours.',
      },
      {
        phase: 'post_launch',
        title: 'Cohort Feedback & Retention',
        timing: 'Day +3 to +7',
        action: 'Review first-week usage metrics and index requested course materials.',
        purpose: 'Solidify retention and build word-of-mouth momentum.',
        suggestedContent: 'Changelog update and community thank-you note.',
        successSignal: '65%+ 7-day query repeat rate.',
      }
    );
  }

  // 11. Extended: First Week Plan
  const rawWeek = Array.isArray(obj.firstWeekPlan) ? obj.firstWeekPlan : [];
  const firstWeekPlan: FirstWeekDayPlan[] = rawWeek.map((w, idx) => {
    const item = w && typeof w === 'object' ? (w as Record<string, unknown>) : {};
    return {
      day: typeof item.day === 'string' && item.day.trim() ? item.day.trim() : `Day 0${idx + 1}`,
      focus: typeof item.focus === 'string' && item.focus.trim() ? item.focus.trim() : 'Operational Readiness',
      action: typeof item.action === 'string' && item.action.trim() ? item.action.trim() : 'Monitor uptime and response latency.',
      targetOutcome: typeof item.targetOutcome === 'string' && item.targetOutcome.trim() ? item.targetOutcome.trim() : 'Stable service under initial load.',
    };
  });

  if (firstWeekPlan.length === 0) {
    firstWeekPlan.push(
      {
        day: 'Day 1',
        focus: 'Launch Day Activation',
        action: 'Publish launch announcement and activate community distribution links.',
        targetOutcome: 'First wave of 300+ onboarded active students.',
      },
      {
        day: 'Day 2-3',
        focus: 'Query Quality Monitoring',
        action: 'Inspect query accuracy and identify high-frequency syllabus topics.',
        targetOutcome: 'Fine-tune retrieval prompts based on actual exam patterns.',
      },
      {
        day: 'Day 4-5',
        focus: 'Peer Referral Expansion',
        action: 'Encourage early adopters to share study group session links.',
        targetOutcome: 'Word-of-mouth organic growth to 1,000+ weekly active users.',
      },
      {
        day: 'Day 6-7',
        focus: 'Weekly Retrospective',
        action: 'Compile feedback, release v1.1 patch, and report metrics to stakeholders.',
        targetOutcome: 'Clear prioritization roadmap for the next sprint.',
      }
    );
  }

  // 12. Extended: Success Signals
  const rawSignals = Array.isArray(obj.successSignals) ? obj.successSignals : [];
  const successSignals: SuccessSignal[] = rawSignals.map((s, idx) => {
    const item = s && typeof s === 'object' ? (s as Record<string, unknown>) : {};
    return {
      metric: typeof item.metric === 'string' && item.metric.trim() ? item.metric.trim() : `Metric 0${idx + 1}`,
      target: typeof item.target === 'string' && item.target.trim() ? item.target.trim() : 'Target Defined',
      whyItMatters: typeof item.whyItMatters === 'string' && item.whyItMatters.trim() ? item.whyItMatters.trim() : 'Core indicator of product-market fit.',
    };
  });

  if (successSignals.length === 0) {
    successSignals.push(
      {
        metric: 'First-Week Active Query Volume',
        target: '2,500+ syllabus and lab queries',
        whyItMatters: 'Demonstrates authentic academic utility over casual curiosity.',
      },
      {
        metric: '7-Day Query Return Rate',
        target: '> 60% repeated study sessions',
        whyItMatters: 'Proves the platform has become part of the daily study habit.',
      },
      {
        metric: 'Organic Peer Referrals',
        target: '35%+ new signups from friend links',
        whyItMatters: 'Indicates high satisfaction and viral word-of-mouth credibility.',
      }
    );
  }

  const sanitized: LaunchKit = {
    oneLinePitch,
    elevatorPitch,
    landingPage,
    socialLaunch,
    pressSnippet,
    launchChecklist,
    launchPositioning,
    coreMessage,
    audienceAngles,
    launchChannels,
    launchContent,
    launchSequence,
    firstWeekPlan,
    successSignals,
  };

  return {
    isValid: true,
    data: sanitized,
  };
}
