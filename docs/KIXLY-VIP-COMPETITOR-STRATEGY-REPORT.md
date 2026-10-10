# Kixly VIP Membership Page
## Competitor Analysis & Strategic Improvement Report

**Prepared for:** Kixly product, design, growth, operations, and compliance teams  
**Research snapshot:** 10 October 2026 (UTC)  
**Primary page audited:** [kixly.co/vip](https://kixly.co/vip)  
**Scope:** Public VIP-page content, comparable crypto sports/esports loyalty experiences, adjacent prediction-market reward UX, and a practical redesign/roadmap.

> **Executive position:** The current Kixly page is not empty. It already publishes six levels, stake thresholds, several reward amounts, exclusions, a benefits table, and FAQs. Its main weakness is not the amount of content; it is the lack of an understandable operating model for a member: **What is my status? What exactly counts? What do I unlock next? What can I claim now? When will it arrive?**
>
> The recommended MVP is a **transparent public explainer plus a personalized status-and-benefits panel after sign-in**. Kixly does not need to copy casino-heavy loyalty mechanics. It should own a clearer, sports-native, wallet-aware membership experience built around explainable effective stake, trustworthy reward status, and responsible progression.

---

## 0. How to read this report

### Evidence labels

- **Verified — public:** Directly visible in a publicly accessible page or official source at the research snapshot date.
- **Needs verification:** Requires a browser session, connected wallet, signed-in account, live API response, responsive visual QA, or confirmation from Kixly product/operations/compliance. This report does not guess.
- **Proposal:** A recommended future experience, not a claim about current Kixly functionality or policy.

### Important limitations

1. The Kixly audit was performed against the publicly retrievable page content. Kixly and several competitors use client-side rendering, Cloudflare/Turnstile, and account-gated states. A text capture cannot establish exact viewport placement, hover behavior, tap behavior, or logged-in functionality.
2. No wallet was connected and no Kixly account was used. The report therefore does **not** claim that a user can or cannot see progress, activity, reward claims, or current benefits after sign-in.
3. Competitor claims are sourced primarily from official public pages. Where a page is historical, region-gated, inconsistent, or currently unavailable, that status is called out explicitly.
4. Published numbers, rules, rewards, and eligibility can change. Product, risk, legal, and finance owners should re-confirm every Kixly amount and rule before launch.

---

# 1. Executive read-out

## 1.1 What is working today

The public page gives Kixly a useful factual base:

- It names **six levels**: Starter / Newcomer, Bronze, Silver, Gold, Platinum, and Black.
- It publishes the thresholds for Starter through Platinum: **0, 2,000, 10,000, 50,000, and 250,000 USDT**, with Black described as invitation-only.
- It describes effective-stake exclusions: cancelled, void, early-settled, hedged, and abnormal bets do not count; it also says parlays accelerate upgrades.
- It lists upgrade and birthday gift amounts for the non-Black levels.
- It includes support, community, withdrawal, events, merchandise, gift-box, and manager benefits by tier.
- It has a comparison table and FAQ questions, rather than relying only on decorative VIP imagery.
- Its `Sign in to see your level, progress, and benefits` CTA correctly signals that personalized data is account-gated.

## 1.2 The five most material problems

1. **The value proposition is descriptive, not useful.** “Six tiers, rising with you” tells users that levels exist but not why Kixly VIP is valuable or what a user should do next.
2. **The core calculation is not explainable.** “Effective USDT stake,” “parlays accelerate upgrades,” “level rebate,” and “abnormal bets” are meaningful program terms, but the page gives no formula, example, multiplier, time window, or definition.
3. **The most important member state is hidden.** The public page asks users to sign in, but there is no visible preview of the status model: current tier, eligible stake, next threshold, remaining amount, last update, or why a bet counted/did not count. The signed-in experience requires verification.
4. **Reward operations are ambiguous.** The page publishes gift amounts but not, in the public content captured, the timing, claim method, cash/physical distinction, expiry, payout currency, reward status, or the amount/logic for “daily red packets.”
5. **The next action is fragmented.** A user is told red packets are claimed on the activity page, yet the public content does not expose a clear activity CTA, “find eligible markets” path, support escalation, or Black-interest route.

## 1.3 The five changes to implement first

1. Replace the hero with a two-mode value proposition: **public education** for signed-out visitors and **current status/progress** for signed-in users.
2. Add a plain-language **“How effective stake works”** block with a formula, worked example, eligible/excluded bet examples, parlay explanation, update timestamp, and link to full rules.
3. Add a **current tier / next tier / remaining USDT / benefits available now** module after sign-in, with a “Why did this bet count?” ledger link.
4. Replace the limited benefits matrix with a **benefit-by-benefit service table**: value, eligibility, payout/fulfillment timing, claim action, status, and terms.
5. Make the page operational: link directly to Activity, eligible markets, support, reward history, and the relevant rules; add analytics and accessibility QA before optimizing visuals.

## 1.4 Recommended MVP

A launchable MVP can be delivered without a new loyalty economy:

- Preserve the current six-level program pending product confirmation.
- Rewrite the hero and section labels in plain language.
- Keep the existing thresholds and published rewards, but label them as current program terms and explain every unit.
- Add a responsive tier comparison table and a signed-out explanation state.
- Add a signed-in status card fed by existing membership data: current tier, effective stake, next threshold, remaining amount, benefits available, and last calculated time.
- Add a short eligibility/rules explainer and complete FAQ answers.
- Link every reward to the activity/claim surface or say explicitly that it is manager/contact-led.
- Instrument the page and run baseline usability testing.

---

# 2. Audit of the current Kixly VIP page

## 2.1 Verified public page structure

The following is the content order returned by the public [Kixly VIP page](https://kixly.co/vip) on 10 October 2026. Actual above-the-fold placement and styling should still be checked in a visual browser session.

| Order | Public content observed | User job supported | Assessment |
|---|---|---|---|
| 1 | Kixly logo and VIP hero asset (`hero-roulette.webp`) | Establish brand/premium context | Strong visual entry point; sports/esports relevance of roulette imagery needs a deliberate brand decision. |
| 2 | `VIP membership`; `Six tiers, rising with you`; `Sign in to see your level, progress, and benefits`; `Sign in` | Explain the existence of VIP and enter the account state | CTA is clear, proposition is too generic, and the value of signing in is not previewed. |
| 3 | `VIP levels`; effective USDT stake rule; exclusions; parlay statement | Understand progression basis | Useful but jargon-heavy and incomplete without a calculation example. |
| 4 | Six illustrated tier cards with threshold and bullets | Scan level-by-level rewards | Good factual foundation; cards do not show current/next state for a member in the public view. |
| 5 | `VIP benefits`; statement that daily red packets follow the level rebate and are claimed on Activity | Understand benefits and route to claim | The phrase introduces an important reward that is not defined in the visible table. Activity destination is not surfaced as a clear CTA in the captured content. |
| 6 | Four-row benefits table for six tiers | Compare upgrade gifts, birthday gifts, withdrawals, VIP community | Better than cards alone, but too narrow to explain all listed benefits or operational details. |
| 7 | Five FAQ question labels | Resolve common rules questions | FAQ topics are appropriate; answer content and accordion accessibility need browser verification. |
| 8 | Rules disclaimer, footer, wallet/Privy and Cloudflare/Turnstile content | Set policy context and account infrastructure | The disclaimer protects the business but does not replace concise, user-readable rules. |

## 2.2 What a user sees first

### Verified

- The public content begins with a brand/logo asset and a VIP hero asset, then the `VIP membership` heading.
- The first copy promises six tiers and asks the visitor to sign in to see their level, progress, and benefits.
- The page does not lead with a concrete member outcome such as “see how much you have earned,” “see what you can claim,” or “know how much is left to the next tier.”

### Needs visual verification

- Whether the hero image occupies most of the first viewport and pushes the heading/CTA below the fold.
- Whether the site header has persistent links to Sports, Esports, Activity, Wallet, Support, or Account.
- Whether the `Sign in` action opens a Privy wallet flow, a separate account flow, or both. Kixly’s public home page says “Connect your wallet and sign in” and its footer exposes “Wallet · Privy,” but the VIP click path was not tested.
- Whether hero text has sufficient contrast over the image on desktop and mobile.

### Strategic implication

A VIP landing page should answer three questions before asking for a wallet connection:

1. **What is VIP for?**
2. **What do I get at each level?**
3. **What will I see or do after I connect?**

Kixly currently answers the second question partially, and delegates the third to sign-in. It does not answer the first sharply enough.

## 2.3 Current program content: what is published vs what is unclear

### Current public tier model as published

| Published tier | Published threshold | Selected published benefits | Confidence / release note |
|---|---:|---|---|
| Starter / Newcomer | 0 USDT | Cumulative effective stake; view VIP progress; live support | Verified public copy. |
| Bronze / Bronze | 2,000 USDT | Upgrade gift 18 USDT; birthday gift 18 USDT; VIP community; community prize draw | Verified public copy; confirm currency, timing, and terms. |
| Silver / Silver | 10,000 USDT | Upgrade gift 58 USDT; birthday gift 38 USDT; fast withdrawal channel/VIP support; offline events/ticket draws | Verified public copy; confirm availability by jurisdiction and account. |
| Gold / Gold | 50,000 USDT | Upgrade gift 188 USDT; birthday gift 88 USDT; priority withdrawal/offline event; advanced community, merch, custom gift box | Verified public copy; fulfilment and eligibility details are not public in the captured page. |
| Platinum / Platinum | 250,000 USDT | Upgrade gift 588 USDT; birthday gift 288 USDT; private event/1:1 service; priority withdrawal/premium gift box | Verified public copy; confirm fulfilment, location, and support SLA. |
| Black / Black | Invitation only | Dedicated manager/direct line; agreed gifts; hospitality/custom events; fast payout line | Verified public copy; invitation criteria, contact route, and service definition are not stated. |

### Published exclusions and terms that need explanation

The page states that effective USDT stake is used and that **parlays accelerate upgrades**. It also says cancelled, void, early-settled, hedged, and abnormal bets do not count. This is valuable transparency, but it leaves high-impact questions unanswered:

- Is effective stake lifetime cumulative, rolling, campaign-period, or another window?
- What is the exact formula for effective stake?
- What does “accelerate” mean for a parlay: a multiplier, a different qualifying amount, or a product rule?
- Are partial cash-outs, live bets, cash-out losses, pushes, and unsettled bets treated differently?
- What qualifies as an “abnormal” bet, and when is a user notified?
- Is the threshold measured per connected wallet, account, or a linked identity?
- When is stake credited: at placement, settlement, or another event?
- How often is the progress calculation refreshed?
- Does a user retain a tier after a period of inactivity or can it decay?

These are **not assumptions about Kixly’s backend**. They are the minimum questions a user needs answered to trust the visible progress number.

### Reward clarity gaps

The current copy contains a few avoidable ambiguities:

- The tier cards use `18 USDT`-style values while the comparison table uses `18U`. Use one standard: `18 USDT`.
- “Daily red packets follow the level rebate” introduces a reward mechanism without a public amount, formula, cadence, eligibility, expiry, or status.
- Upgrade and birthday gifts have an amount but not a claim/payout date, automatic vs manual delivery, withdrawal restrictions, currency, or whether the amount is cash or a bonus.
- Black birthday gifts are shown as `888U / by agreement` in the table but `agreed 1:1` in the tier card. This should be one governed source of truth.
- “Fast withdrawal channel,” “priority withdrawal,” and “dedicated fast payout line” are service promises. The page should state operational meaning or link to the relevant SLA/terms rather than rely on prestige language.
- Offline benefits cannot be cashed out, according to the disclaimer, but the public copy does not explain location, availability, booking, or cancellation rules.

## 2.4 Strengths worth preserving

1. **Public thresholds:** Users can discover that progression is real and not entirely invitation-gated.
2. **Public reward examples:** Concrete gift values are more useful than “exclusive rewards” language alone.
3. **Exclusion disclosure:** Stating that void/early-settled/hedged/abnormal bets do not count is better than hiding the rule.
4. **Tier cards plus comparison table:** The page supports both emotional browsing and factual comparison.
5. **Clear sign-in intent:** The CTA says why a user should sign in: to see level, progress, and benefits.
6. **Support is acknowledged at Starter and higher tiers:** This can become a clear support/contact path rather than an isolated bullet.
7. **Brand assets exist:** Kixly has a recognizable hero, section mark, and tier artwork; the solution should improve information design without replacing the entire brand.

## 2.5 Prioritized page weaknesses and friction points

| Priority | Issue | Evidence | User impact | Concrete fix |
|---|---|---|---|---|
| P0 | Weak proposition | Hero says `VIP membership` and `Six tiers, rising with you` | A new user cannot tell the practical value or why VIP matters to a sports-prediction participant. | Lead with a benefit plus clarity: “Track your Kixly VIP tier, see what counts, and know exactly what you unlock next.” Use only benefits confirmed by product. |
| P0 | No explainable progress model | “Effective USDT stake” and “parlays accelerate” are not defined | Users cannot reconcile their own bets with the progress number; support load and distrust increase. | Add formula, examples, exclusions, last-calculated time, and a stake ledger. |
| P0 | Personalized value is gated with no preview | Sign-in is required for level/progress/benefits | Signed-out visitors see a generic page and may not know what happens after connecting. | Show a public “what you will see” status mock and make the two states explicit: public explainer vs connected member dashboard. |
| P0 | Benefit information is incomplete | Table only covers four benefit rows; cards contain more; red packets are unexplained | Users cannot compare the actual value or claim path. | Use one canonical benefits dataset and display amount, status, timing, claim route, and terms. |
| P0 | Black tier route is absent | Black is invitation-only with no criteria or contact route | High-value users do not know whether to wait, qualify, or contact support. | Add “How invitations work” or “Request a VIP review,” subject to risk/compliance approval. |
| P1 | Reward operations are opaque | No public timing/claim/expiry details captured | A gift may feel promised but unavailable. | Add a reward status model: available, pending, claimed, fulfilled, expired, not eligible, with reason. |
| P1 | Important Activity dependency is not actionable | Text says red packets are claimed on Activity | Users may have to hunt through the product. | Use deep link/CTA: `Open Activity`; return to VIP with context. |
| P1 | Inconsistent terminology and units | `Starter / Newcomer`, `Black / Black`, `18 USDT` vs `18U`, `level rebate` | Users interpret the page as unfinished or localized inconsistently. | Establish a glossary and content QA checklist. |
| P1 | FAQ answers/rules not verifiable in public capture | Only question labels were exposed | Users may not get answers, search engines may not index them, and screen readers may not receive state. | Verify accordion, publish answer text in accessible DOM, and link to full rules. |
| P1 | No visible service-level detail | Fast/priority withdrawal and 1:1 service are undefined | Benefits sound promotional rather than dependable. | Define operational meaning, availability, and exceptions or soften the copy. |
| P2 | Visual/accessibility quality is unverified | Text fetch exposes assets but not CSS/interaction | Contrast, focus, mobile table behavior, and image alt text may fail users. | Run a 320–1440px visual QA pass and WCAG 2.2 AA checks. |
| P2 | No explicit safety/trust context in the value flow | Disclaimer is broad and placed at the end | A crypto betting loyalty page can be perceived as pressure to wager more. | Add concise responsible-play/risk/rules links without blocking the main explanation. |

## 2.6 What is verified vs what must be tested

| Area | Verified from public page | Do not assume; verify next |
|---|---|---|
| Tiers | Six named levels are published | Whether tiers shown to a connected user are dynamic, localized, or different by account. |
| Thresholds | 0, 2,000, 10,000, 50,000, 250,000 USDT and Black invitation-only are published | Whether thresholds are lifetime, rolling, campaign-specific, or subject to account/risk overrides. |
| Progress | Page promises users can see level and progress after sign-in | Actual API loading, precision, timestamp, refresh cadence, and error state. |
| Wallet | Kixly home says connect wallet and sign in; footer references Privy | Whether VIP status keys off wallet, Kixly account, or a linked identity; whether multiple wallets can be linked. |
| Benefits | Tier cards and a four-row benefits table are publicly present | Whether each benefit is active for every user, jurisdiction, sport, product, or risk segment. |
| Red packets | Page says they follow level rebate and are claimed on Activity | Amount, formula, cadence, eligibility, expiry, claim UX, and whether they are cash/bonus. |
| FAQ | Five questions are visible in the public extraction | Answer content, accordion semantics, keyboard access, and mobile behavior. |
| Navigation | Public extraction includes `Sign in`, but not a full site navigation map | Header links, Activity deep link, market CTA, support link, and logged-in navigation. |
| Responsiveness | No reliable text-only conclusion | Desktop/mobile screenshots, table overflow, image cropping, touch targets, and load performance. |
| Accessibility | Cannot establish from text extraction | Semantic headings, alt text, contrast, focus order, ARIA, reduced motion, and screen-reader table experience. |

---

# 3. Competitor and reference research

## 3.1 Why these references were selected

Kixly sits between several product patterns:

- **Direct crypto betting/casino loyalty:** Stake, Cloudbet, BC.Game, and Thunderpick show how crypto platforms package levels, cash rewards, support, and progression.
- **Sports/esports loyalty:** Thunderpick is the closest reference for an esports-native, game-like progression model.
- **Prediction-market rewards:** Polymarket is a close reference for a trading-style volume formula, time-windowed tiers, profile status, and transparent rebate mechanics.
- **Reward lifecycle UX:** Kalshi is useful for personalized reward cards, requirements, deadlines, claim states, and activity records, even though it is not a VIP-tier program.
- **Historical pattern only:** Rollbit has useful official examples of reward dashboards and calendars, but the cited pages explicitly say they are outdated or describe past iterations. It should not be treated as current product truth.
- **Excluded from active benchmarking:** Rivalry’s official site currently says operations have ceased, so historical Rivalry VIP claims are not a current competitor benchmark.

## 3.2 Competitor profiles

### A. Stake — clear public tier ladder and benefit unlocks

**Current public evidence:** [Stake VIP Club](https://stake.com/vip-club) exposes a strong landing-page structure: hero proposition, Register CTA, tier cards, wager thresholds, benefits, and a dedicated-host explanation.

**Published structure and features:**

- Hero: “The unrivalled VIP experience,” with instantly withdrawable bonuses without strings attached.
- Public tier ladder: Bronze ($10k), Silver ($50k), Gold ($100k), Platinum I–III ($250k–$2.5M), Platinum IV–VI ($2.5M–$25M), and Diamond I–V from $25M.
- Benefits are grouped into weekly/monthly bonuses, rakeback, level-ups, daily bonuses/reloads, VIP-host bonuses, renewable reloads, recent-play bonuses, and bespoke benefits.
- The page shows what changes between levels rather than only listing names.

**What Kixly should learn:**

1. Make progression legible at a glance: threshold first, unlocks second.
2. Show the benefit delta when moving to the next tier.
3. Use a strong top CTA tied to a clear outcome.
4. Treat the dedicated host as a service model with a defined tier trigger, not just a decorative bullet.

**Cautions:** Stake is a casino/sportsbook with a much larger rewards economy. Kixly should not copy high-roller economics or encourage wagering without risk/compliance review. The Stake page was fetched with a restricted-region query; regional availability and exact values should be checked for the user’s market.

### B. Cloudbet — calculator, status transfer, and a service-led VIP narrative

**Current public evidence:** [Cloudbet VIP Club](https://www.cloudbet.com/en/lp/vip-club) includes a hero CTA, VIP status transfer, reward benefits, an announced tier calculator, testimonials, and a public tier table.

**Published structure and features:**

- Hero makes the benefit proposition specific: cash payouts, no-limit sports betting, events, and a dedicated manager.
- Primary CTA: `Request VIP status`; secondary path: bring status from another platform.
- Benefit blocks explain back-on-house-edge rewards, scheduled drops, referrals/tournaments, no-limit betting, and host support.
- A calculator is positioned as a way to understand what play is worth at each tier.
- FAQ includes tier, reward, host, and maintenance questions.

**What Kixly should learn:**

1. Give users an immediate method to estimate their position or potential benefit.
2. Make the service path explicit: self-serve progression versus human VIP review.
3. Put the answer to “what do I receive and when?” next to the claim/qualification action.
4. Use proof and service detail only when Kixly can substantiate it.

**Caution:** The public page has an internal content inconsistency: its FAQ says there are four VIP tiers while the table lists eight tiers from Bronze through Blue Diamond. That is a useful reminder that reward content needs a single governed source of truth.

### C. BC.Game — benefit-led and low-barrier, but public qualification is opaque

**Current public evidence:** [BC.Game VIP Club](https://bc.game/vip-detail) leads with “Exclusive rewards / Elite VIP experience,” a Join Now CTA, VIP transfer, benefit tiles, activity/loyalty/no-barriers messaging, and FAQs.

**Published structure and features:**

- Instant lossback, reload bonuses, gameplay bonuses, top-player bonuses, fee-free deposit/withdrawal claims, IRL events, and a dedicated VIP host are presented as discrete benefits.
- “VIP transfer” is treated as a primary entry route.
- The page says there are no level or specific-game requirements and that activity and loyalty help users stand out.
- FAQ is organized into General, Benefits, and Terms of Service.
- The footer includes responsible gaming and self-exclusion language.

**What Kixly should learn:**

1. Give each benefit a single scannable explanation and icon/label.
2. Include a FAQ category for terms, not just marketing copy.
3. Keep support and responsible-play access visible.
4. If Kixly wants invitation-based Black access, explain how a user gets reviewed.

**Caution:** The public page does not expose a clear tier ladder or numerical qualification model. Kixly should not trade its current threshold transparency for a more mysterious VIP experience.

### D. Thunderpick — esports-native XP, sub-levels, and a rewards dashboard

**Current public evidence:** [Thunderpick’s 2025 Rewards Program announcement](https://thunderpick.io/blog/new-thunderpick-rewards-program) describes a unified XP system, game-inspired ranks, sub-levels, automated rewards, no rank decay, quests, badges, and a rewards dashboard. The [current Thunderpick home page](https://thunderpick.io/) exposes Rewards, Giveaways, Races, and Thunder VIP Club navigation.

**Published structure and features in the announcement:**

- Every €1 wagered earns 1 XP as standard; promotional multipliers can apply.
- Ranks run from Unranked through Iron, Bronze, Silver, Gold, Platinum, Emerald, Diamond, Master, Divine, Immortal, and Global Elite.
- Most tiers contain ten sub-levels, creating more frequent milestones.
- Benefits include races, giveaways, free spins, cash bonuses, reloads, rank-up deposits, priority withdrawals, and higher limits.
- Rewards are described as largely automatic and visible in a redesigned dashboard.
- Daily quests, trophies, badges, and referral-based XP are part of the announced direction; exact rollout status should be checked before treating all as live.

**What Kixly should learn:**

1. A simple unit and frequent milestones make progression easier to understand.
2. “No rank decay” is a powerful trust proposition if Kixly’s policy supports it.
3. Automatic reward posting reduces missed claims and support tickets.
4. Esports-native language, badges, and achievement moments can differentiate Kixly from casino-style VIP pages.

**Caution:** This is an official 2025 announcement, not a guarantee that every announced feature is live today. It should be used as a design reference, not as current feature evidence.

### E. Polymarket — closest reference for prediction-market calculation transparency

**Current public evidence:** [Polymarket Taker Rebate Program documentation](https://docs.polymarket.com/programs/taker-rebates) publishes a formula, category weights, a 30-day weighted-volume window, tier thresholds, rebates, level-up bonuses, update timing, and edge cases.

**Published structure and features:**

- Weighted Volume is calculated from trade size, entry price, category weight, and bonuses.
- Sports has a published category weight; other categories differ.
- Tiers are based on the last 30 days, update daily, and are shown on a profile and leaderboards.
- The tier table includes threshold, rebate, and one-time level-up bonus.
- The documentation explicitly separates taker tiering from maker rewards.
- It states when rebates are paid and that there is a minimum payout threshold.
- It explains what happens when activity drops below a threshold and calls out disallowed activity.

**What Kixly should learn:**

1. Explain the calculation, not just the outcome.
2. Show the relevant time window and update timestamp.
3. Separate different reward systems rather than call them all “VIP.”
4. Put status on the profile and make the rules addressable.
5. Treat edge cases and anti-abuse rules as product education, not only legal copy.

**Caution:** Polymarket is a prediction-market exchange, not a direct Kixly peer. Its current numbers and formula must not be copied into Kixly.

### F. Kalshi — strong reward-progress and claim-state UX reference

**Current public evidence:** [Kalshi Referral Program FAQ](https://help.kalshi.com/en/articles/13823783-kalshi-referral-program-faq) describes a personalized `Your rewards` area, offer cards, requirements, deadlines, claim/unlock actions, activity/credit history, and offer-specific terms.

**Published structure and features:**

- Users enter `Explore → menu → Your rewards` and see offers and requirements.
- The page distinguishes automatic credits from rewards that require a claim.
- It shows progress cards and “See all steps” flows.
- It explains where credits appear in Activity and how offer-specific restrictions work.
- It warns that “up to” amounts are maximums, not guarantees, and that requirements vary.

**What Kixly should learn:**

1. Model rewards as a lifecycle, not a static list.
2. Make the next action and remaining requirements visible.
3. Link from reward status to account activity/credit history.
4. Put offer-specific terms next to the offer rather than burying them.
5. Use annotated visual references and empty states to teach the flow.

**Caution:** Kalshi’s referral rewards are not a Kixly VIP tier program. The transferable lesson is state clarity, not the incentive design.

### G. Rollbit — historical dashboard reference only

**Evidence status:** Rollbit’s current public site could not be reliably inspected from this environment; the [current response says Rollbit is unavailable in this country](https://rollbit.com/blocked). Its own [Rewards Breakdown article](https://blog.rollbit.com/rollbit-rewards-breakdown/) is explicitly marked outdated, and its [2023 Rewards Calendar article](https://blog.rollbit.com/rollbit-rewards-rewards-calendar/) describes a prior iteration.

**Historical UX patterns worth noting, not current facts:**

- A dedicated rewards dashboard with pending rewards and claim history.
- Daily/weekly/monthly rewards organized in a calendar.
- A visible progress/level system and leaderboards.
- A distinction between immediate credit and rewards released over time.

**Strategic use:** Borrow the information architecture pattern—pending, available, claimed, expiring—not the historical rates, reward percentages, or mechanics.

### H. Rivalry — removed from active competitor set

[Rivalry’s official operational status page](https://www.rivalry.com/operationally-closed) currently says operations have ceased and player access is no longer available. Older articles describe esports missions and VIP rewards, but they are not a current benchmark. This is a reminder to timestamp competitor research and verify that a reference product is still operating.

## 3.3 Cross-competitor patterns

| Pattern | Evidence in references | Implication for Kixly |
|---|---|---|
| Concrete public ladder | Stake, Cloudbet, Polymarket | Keep public thresholds, but explain the calculation and status window. |
| Personalized progress surface | Polymarket profile, Kalshi rewards, Thunderpick dashboard | Build a member status card, not just a marketing page. |
| Reward lifecycle | Kalshi, Cloudbet, historical Rollbit | Show available, pending, claimed, fulfilled, and expired states. |
| Automatic or centralized claiming | Thunderpick dashboard; Cloudbet Rewards Calendar; Kalshi Activity | Deep-link every reward to its real operational surface. |
| Human service escalation | Stake, Cloudbet, BC.Game | Define support/manager paths for higher tiers without hiding the rules. |
| Gamified progression | Thunderpick ranks/sub-levels, Rollbit history | Use esports-native milestones only if they clarify, not if they distract. |
| Transparent calculation | Polymarket | Publish formula, time window, examples, and edge cases. |
| Transfer/invitation path | Cloudbet and BC.Game | Consider Black review or status review later, subject to anti-abuse and compliance controls. |
| Trust and guardrails | BC.Game responsible-gaming footer; rule detail in Polymarket/Kalshi docs | Make rules and responsible play easy to find, not only a final disclaimer. |

---

# 4. Competitor comparison matrix

| Evaluation area | Kixly current experience | Competitor examples | Identified gap | Recommended improvement |
|---|---|---|---|---|
| Value proposition | “VIP membership”; “Six tiers, rising with you” | Stake leads with an unrivalled VIP experience; Cloudbet leads with cash, events, limits, and a manager; Thunderpick ties progress to game-like rewards | Kixly names the program but not the user outcome | Use a concrete but approved promise: `See your tier, understand what counts, and know what you unlock next`. Follow with the two or three benefits Kixly can actually deliver. |
| First CTA | `Sign in` to see level, progress, and benefits | Stake `Register`; Cloudbet `Request VIP status`; BC.Game `Join Now` and `VIP Transfer`; Kalshi contextual `See all steps` | Kixly’s CTA is clear but not sufficient for a new visitor who wants to learn first | Keep `View VIP benefits` or anchor scroll as secondary; use `View my VIP status` when signed in; add `Open Activity` where relevant. |
| Public tier ladder | Six levels and thresholds are visible | Stake, Cloudbet, Polymarket publish tier structures; BC.Game is less numerical | Kixly is strong on names/thresholds but weak on calculation and tier delta | Keep the ladder; add current/next states and “what changes at this tier.” |
| Qualification rule | Effective USDT stake; exclusions and parlay acceleration stated | Polymarket publishes a formula, weights, rolling window, daily update, and edge cases; Thunderpick publishes XP conversion | Kixly’s most important term is not explainable | Add formula, examples, timestamp, eligible-stake ledger, and full rules link. |
| Progress status | Promised after sign-in; not shown publicly | Polymarket shows tier on profile; Thunderpick describes a rewards dashboard; Kalshi shows progress cards | Status model is invisible until connection and unverified | Signed-in card: current tier, eligible stake, next threshold, remaining amount, last updated, and benefit status. |
| Tier threshold scanability | Thresholds are on illustrated cards | Stake’s cards combine wager amount and unlocks; Cloudbet provides a table and calculator | Kixly cards are visually engaging but comparison requires scanning six cards and a separate table | Use cards for browse and one canonical comparison table for decision-making; highlight `Current` and `Next`. |
| Benefit breadth | Cards list many benefits; table includes only four rows | Stake and Cloudbet group recurring rewards, host, reload, and bespoke services; BC.Game uses benefit tiles | No single source of truth; some benefits appear only in one component | Create a benefits schema with type, value, availability, cadence, claim method, and terms. |
| Reward amount clarity | Upgrade and birthday gift figures are shown; red packets are not quantified | Polymarket publishes rebates/bonuses; Cloudbet publishes a tier table; Kalshi warns that “up to” varies by offer | Amount alone does not tell the user what arrives or when | Show amount plus payout/fulfilment timing, cash/physical/bonus label, expiry, and exact claim state. |
| Reward claims | Red packets reportedly claimed on Activity; no surfaced deep link in capture | Kalshi links rewards to Activity; Cloudbet has Rewards Calendar; historical Rollbit had a dashboard | Users may not know where to claim or whether a gift is pending | Add contextual `Claim`, `Open Activity`, or `Contact VIP support` actions with status. |
| Progress cadence | Not stated | Polymarket states daily update; Thunderpick uses XP; Cloudbet describes tier milestones | Users cannot know how quickly a new bet changes status | State the event that credits stake and the refresh cadence. |
| Status decay | Not stated publicly | Thunderpick announcement explicitly removes rank decay; Polymarket documents tier movement when 30-day volume drops | Uncertainty can create distrust or surprise demotion | Publish `No decay` if true; otherwise show grace/decay rule and warnings before status change. |
| Support/service | Live support at Starter; VIP support/manager at higher tiers | Stake, Cloudbet, BC.Game foreground dedicated hosts; Cloudbet has a status-request path | Kixly does not show how a user reaches the right service path | Add support CTA and service definition; for Black, add review/request route if approved. |
| Sports/esports fit | Kixly has sports/esports brand but hero asset is roulette and benefits are generic VIP | Thunderpick uses esports rank language; Polymarket separates sports from other categories | Kixly’s loyalty experience can be more native to prediction markets than casino metaphors | Use market/trading language, match/event milestones, and sports/esports progress contexts without implying extra wagering. |
| Trust/rules | Broad final disclaimer; exclusions in one paragraph | Polymarket documents formula and anti-abuse; BC.Game exposes responsible gaming; Kalshi places offer rules next to reward flow | Legal text is not converted into usable guidance | Add `How VIP is calculated`, `Reward terms`, `Responsible play`, and `Contact support` links near relevant UI. |
| Wallet/account model | Home says connect wallet and sign in; VIP CTA says sign in | Crypto competitors vary between account, wallet, or host models | Users may not know whether progress follows wallet, account, or both | Explain identity in one sentence and provide wallet/account error states; verify with Privy implementation. |
| Mobile behavior | Not verifiable from public extraction | Competitors commonly use cards, dashboards, and mobile app flows | Six columns/table/hero imagery may be hard to use on small screens | Stack tier cards, use a responsive benefit list or horizontal comparison with accessible headers, and test 320px+. |
| Accessibility | Not verifiable | Reference pages expose headings/tables but implementation quality varies | Potential risk in decorative images, accordion states, contrast, and table scanning | Run WCAG 2.2 AA audit; make all progression states text-readable and keyboard accessible. |
| Differentiation opportunity | Existing combination of USDT stake, sports/esports prediction, parlay rule, community/events | Casino competitors compete on cashback/hosts; prediction markets compete on transparent mechanics | Copying cashback/host language would make Kixly look generic | Own “explainable prediction-market membership”: clear stake ledger, match-native status, fair benefit visibility, and community experiences. |

---

# 5. Recommended Kixly VIP information architecture

The page should work in two modes without duplicating content:

- **Public mode:** explain the program, benefits, rules, and how to connect.
- **Member mode:** replace generic hero content with the user’s status, progress, available benefits, and next actions.

## 5.1 Proposed section specification

| Section | Purpose | Suggested content | Recommended layout | UX improvement | Phase |
|---|---|---|---|---|---|
| 0. Persistent utility/header | Prevent the VIP page from becoming a dead-end | Kixly logo; Sports; Esports; Activity; Wallet/Account; Support; current connection state | Existing header pattern; compact sticky header on mobile | Lets users move from benefits to eligible markets, activity, or support | Essential launch |
| 1. VIP hero | State the value in one sentence and route both audiences | Public: `Track your Kixly VIP tier, understand what counts, and see what unlocks next.` Member: `You are Silver — 2,460 USDT of eligible stake.` Secondary line should name confirmed benefits only | Hero image retained but with readable text panel/overlay; two CTAs | Replaces vague prestige language with an actionable promise | Essential launch |
| 2. Status and progress | Answer “where am I?” and “what next?” | Current tier; effective eligible stake; next tier; threshold; remaining amount; last updated; `How is this calculated?` | High-contrast status card immediately below hero; progress bar plus numeric values | Converts a marketing page into a useful member tool | Essential for member MVP |
| 3. Quick action strip | Give the user a next step | `Open Activity`; `View eligible markets`; `View benefits`; `Contact VIP support` | Four buttons/cards, 2×2 on mobile | Removes the hunt for the next page | Essential launch |
| 4. How effective stake works | Build confidence in the qualification rule | Plain-language definition; formula approved by product; one single bet example; parlay example; excluded-bet examples; stake credit event; refresh cadence; full rules link | Short explainer with expandable details; use diagrams only when they clarify | Makes progress auditable and reduces “why did this not count?” tickets | Essential launch |
| 5. Tier ladder | Show the path and the meaningful differences | Current published tier names/thresholds; `Current`, `Next`, or `Invitation`; one-line unlock summary; “compare all benefits” | Desktop: horizontal ladder plus table; mobile: stacked cards with current/next highlighted | Retains emotional progression while improving scanability | Essential launch |
| 6. Benefits comparison | Let a user decide whether a benefit is available and what to do | Rows for upgrade gift, birthday gift, withdrawals, community, events, gifts, manager/support, red packets; amount/value; availability; cadence; claim/fulfilment; terms | Accessible comparison table on desktop; benefit cards or row accordion on mobile | Removes contradictions between cards and table | Essential launch |
| 7. Reward/activity summary | Show whether value has arrived | Available, pending, claimed, fulfilled, expired; date; amount/type; source tier; CTA to Activity | Signed-in activity preview with `View all`; signed-out teaser | Makes benefits tangible and reduces missed claims | Phase 2 core |
| 8. VIP events and community | Make non-cash value concrete | Current or upcoming events, ticket draws, community access, merch/gift fulfilment; location/eligibility | Only show live items; empty state says when next update is expected | Turns vague offline/community bullets into real membership value | Phase 2 or when inventory exists |
| 9. Black / VIP review path | Explain invitation-only status | What is known; how invitations are delivered; service/support contact; no invented qualification promise | Separate card with `Contact support` or `Request review` if approved | Removes uncertainty for high-value users without publishing confidential rules | Phase 2, compliance-dependent |
| 10. FAQ and rules | Answer edge cases where users make decisions | How to level up; what does not count; how birthday/upgrade gifts pay; offline invitation; reward timing; status decay; wallet/account; responsible play | Searchable accordion with anchor links and accessible expanded states | Converts legal ambiguity into task-level answers | Essential launch |
| 11. Trust and responsible play | Keep a high-stakes product honest and safe | Terms; reward rules; risk/account review; responsible-play controls; self-exclusion/cooling-off where applicable; support | Quiet but visible footer panel; no dark patterns | Protects users and Kixly; reinforces that VIP is not a reason to chase losses | Essential launch |

## 5.2 Recommended copy direction

### Public hero proposal

> **Kixly VIP, made clear.**  
> Track your tier, see what counts toward progress, and understand what you unlock at every level.
>
> `View VIP benefits` &nbsp; `Sign in to see my status`

This copy makes no unconfirmed financial promise. If product confirms a specific benefit, a second sentence can be more concrete, for example: “From upgrade and birthday gifts to priority service, your benefits are shown by tier.”

### Signed-in hero proposal

> **Your Kixly VIP status**  
> **[Current tier]** · **[eligible effective stake] USDT**  
> **[remaining] USDT to [next tier]** · Updated [time]
>
> `Open Activity` &nbsp; `How progress is calculated`

Use placeholders in design files only. Do not ship a fake current status.

### Benefit row content model

Every benefit should answer:

1. What is it called?
2. What is the published amount/value, if any?
3. Who is eligible?
4. When is it issued or fulfilled?
5. Does the user need to claim it?
6. Where does the user claim or track it?
7. Is it cash, bonus, physical, event access, service, or invitation?
8. What terms/exclusions apply?

## 5.3 Tier data governance

Create one structured source of truth for the CMS/API, then render cards, table, FAQs, and member status from it. Minimum fields:

```text
Tier id
Public name
Display label and localization
Threshold and unit
Threshold type/window
Eligible stake formula version
Published benefits
Benefit value and currency
Benefit category: cash / bonus / physical / service / event / access
Availability by jurisdiction/product/risk segment
Issue or fulfilment timing
Claim method and destination
Expiry
Terms URL
Effective date
Last reviewed by product, finance, operations, and compliance
```

This prevents the current problem where a benefit appears in a tier card but not in the table, and where Black birthday wording differs between components.

---

# 6. Practical feature ideas and differentiation

The following proposals intentionally prioritize clarity and measurable utility over visual novelty. None of them should be interpreted as a commitment to new rewards or eligibility rules.

| # | Feature | User problem solved | How it would work | Why valuable | Complexity | Expected impact | Dependencies / risks |
|---:|---|---|---|---|---|---|---|
| 1 | **My VIP status card** | A member cannot tell where they stand | After sign-in, load current tier, effective stake, next tier, remaining amount, benefit status, and last update | Makes the page useful on every visit; strongest conversion of page from brochure to product | Medium | High | Membership API; wallet/account identity; stale-data/error states; never display a false zero. |
| 2 | **Eligible-stake ledger** | Users do not know why a bet counted or did not count | Link from progress to a filtered Activity view showing qualifying amount, excluded reason, bet/event ID, settlement state, and timestamp | Builds trust and reduces support disputes | High | High | Bet ledger, exclusion reason taxonomy, privacy/security, anti-abuse policy. |
| 3 | **Next-tier calculator** | Thresholds are static and not personalized | Show `current eligible stake`, `next threshold`, and `amount remaining`; optionally allow a clearly labelled scenario calculator for approved parlay rules | Makes progression understandable without guessing | Medium | High | Accurate formula and parlay multiplier; avoid framing as a reason to chase losses. |
| 4 | **Benefit comparison with “what changes”** | Six cards and a narrow table require mental diffing | Highlight only the benefits added or changed at the next tier; provide full accessible table | Faster decisions and easier presentation to stakeholders/users | Low | High | Canonical benefits data; mobile pattern; content review. |
| 5 | **Reward lifecycle / claim center** | Users see a promise but not whether it arrived | Each reward has `locked`, `pending`, `available`, `claimed`, `fulfilled`, `expired`, or `not eligible` plus action | Converts perceived value into usable value; reduces missed claims | Medium | High | Activity/reward service; claim endpoints; physical fulfilment/events; terms. |
| 6 | **Automatic status notifications** | Users miss upgrades or do not know when a reward is ready | In-product banner and optional wallet/account notification when tier/reward status changes | Increases return visits and claim rate without adding page clutter | Medium | Medium/High | Notification consent, event triggers, localization, abuse controls. |
| 7 | **“Why did this count?” explainer** | Terms such as hedged/early-settled/abnormal are opaque | Contextual tooltip/modal with approved examples and link to rule version | Reduces jargon and makes support answers reusable | Low | High | Compliance-approved language; accessible modal/tooltip. |
| 8 | **Activity deep links** | Page tells users to claim on Activity but does not route them | `Open Activity` takes the user to the exact reward filter and returns to VIP | Shortens the path to value; easy to measure | Low | High | Stable route and authenticated state; mobile deep-link handling. |
| 9 | **Esports-native milestone badges** | A generic casino-style ladder does not feel native to Kixly | Optional badges for confirmed product milestones such as first market, event participation, or community contribution—not higher spend | Differentiates Kixly and can reward healthy product breadth | Medium | Medium | Product design and responsible-play review; do not reward losses or excessive wagering. |
| 10 | **VIP service directory** | “Live support,” “VIP support,” and “manager” are vague | Show channel, hours, expected response, eligible tier, and what the team can help with | Makes service benefits credible and lowers escalation friction | Low/Medium | Medium | Operations SLA, support routing, regional availability. |
| 11 | **Black invitation / review flow** | Invitation-only users do not know whether to wait or ask | If approved, show an interest/request form with clear non-guarantee language and review status | Gives the top tier an understandable path without publishing confidential risk rules | Medium | Medium | Compliance, CRM, risk approval, privacy, manual review capacity. |
| 12 | **Reward and rule changelog** | Users cannot tell whether a rule or benefit changed | On the page and in help center, show effective date and a short change summary | Trust, auditability, and fewer “it used to say” disputes | Low | Medium | Content governance, versioned terms, notification policy. |
| 13 | **Localization and unit guardrails** | `U`, duplicate names, and mixed wording undermine trust | Use `USDT` consistently, locale-aware numbers, screen-reader labels, glossary, and content linting | Small effort with outsized credibility and comprehension benefit | Low | Medium/High | Design/content system; legal copy review. |
| 14 | **Responsible-play status panel** | VIP progression can accidentally encourage chasing activity | Link to limits, cooling-off/self-exclusion/support; avoid “only X more to spend” pressure copy | Protects users and Kixly; supports responsible product positioning | Medium | High (risk reduction) | Jurisdictional requirements, account controls, policy and compliance. |

### Feature prioritization rule

Implement features that answer **status, calculation, benefit availability, and claim route** before adding leaderboards, social status, animations, or new reward types. A beautiful page that still cannot explain a missing reward is not a successful VIP experience.

---

# 7. Visual and UI/UX recommendations

## 7.1 Page hierarchy and order

Recommended order:

1. Persistent header and connection state.
2. Hero/value proposition.
3. Member status or public-mode explanation.
4. Next actions.
5. How effective stake works.
6. Tier ladder and thresholds.
7. Benefits comparison.
8. Reward/activity summary.
9. Events/community/service.
10. FAQ, rules, responsible play, support.

This order follows the user’s decision sequence: **What is this? → Where am I? → What counts? → What do I get? → How do I claim it? → What are the rules?**

## 7.2 Typography and readability

- Keep Kixly’s existing type and visual personality, but use a clear hierarchy: one H1, descriptive H2s, and sentence-case explanatory copy.
- Minimum body size: 16px for primary content; line height around 1.45–1.6. Avoid placing long rules in all caps or over artwork.
- Put the number and unit together: `2,000 USDT`, not `2,000` on one line and `U` elsewhere.
- Use tabular numerals for thresholds and progress values so numbers align.
- Do not communicate “higher is better” only through metallic color or size; always include the tier name and text label.
- Keep paragraph measure around 60–75 characters on desktop and use short bullets for exclusions.

## 7.3 Color and contrast

- Retain Kixly’s dark/illustrated brand language and existing tier artwork where it helps recognition.
- Choose one high-contrast accent for the current tier, CTA, and progress fill. Do not assign six low-contrast metallic colors to six states.
- Meet WCAG 2.2 AA for normal text and controls. Check text over hero art in every responsive crop.
- Use icons plus labels for `Current`, `Next`, `Available`, `Pending`, and `Invitation only`; never rely on hue alone.
- Keep destructive/safety actions visually distinct from reward CTAs.

## 7.4 Tier cards and comparison table

**Desktop:**

- Six cards can remain as a browse layer, but each should include: tier name, threshold, one-line proposition, top benefits, and a state badge.
- A comparison table should be the canonical detail view. Put benefits in rows and tiers in columns; use check marks only when the underlying eligibility is binary.
- Highlight the current and next tier with a border/label, not a huge glow.
- Show a `View full terms` link for every reward with conditions.

**Mobile:**

- Stack cards and show `Current` / `Next` before the full ladder.
- Do not squeeze six tiers into six narrow columns. Use either: (a) one tier card per slide with accessible previous/next buttons and an all-tier list, or (b) a horizontally scrollable table with sticky row labels and a visible scroll cue.
- Make every benefit an accordion row with the value and status visible before expansion.

## 7.5 Progress bars and status indicators

A progress bar must never be the only representation. Use:

```text
Current: Silver
Eligible effective stake: 7,420 USDT
Next: Gold at 50,000 USDT
Remaining: 42,580 USDT
Updated: 10 Oct 2026, 14:32 UTC
[How is this calculated?]
```

- Include numeric values and a text alternative for screen readers.
- Label the denominator (`toward Gold`) so a generic 15% bar is not misleading.
- For Black, do not show a fake percentage. Use `Invitation only` plus approved review/support path.
- Show stale, loading, and error states. A progress bar frozen without a timestamp is a trust problem.
- Do not use copy such as “just X more to wager” without responsible-play review; prefer “remaining eligible stake, subject to the program rules.”

## 7.6 CTA placement

- Hero: one primary CTA for the current state, one secondary education CTA.
- Status card: `Open Activity` and `How progress is calculated`.
- Benefits: `Claim`, `View Activity`, `See terms`, or `Contact support`, depending on actual fulfillment.
- Black: `Contact VIP support` or `Request review` only if an approved workflow exists.
- Mobile: a non-obstructive sticky bottom action can show `View status` or `Open Activity`; do not cover content or safety links.

## 7.7 Mobile-first, performance, and responsive QA

Test at minimum: 320×568, 375×667, 390×844, 430×932, tablet portrait, and desktop widths.

Checklist:

- Hero art crops without hiding the H1/CTA.
- No horizontal page overflow; table overflow has a visible scroll affordance.
- Tap targets are at least approximately 44×44 CSS px.
- FAQ controls have a visible expanded/collapsed state and preserve scroll position.
- Wallet/Privy modal works on mobile browsers and returns the user to the correct page/state.
- Large hero and tier assets are responsive and lazy-loaded below the fold.
- Aim for Core Web Vitals targets such as LCP ≤2.5s, INP ≤200ms, and CLS ≤0.1 on a representative mobile connection; confirm realistic targets with Kixly traffic and asset weight.
- Respect `prefers-reduced-motion`; avoid animated reward confetti that blocks reading or claim actions.

## 7.8 Empty, loading, disconnected, and error states

### Disconnected / signed out

> **See the program first. Connect when you are ready.**  
> Browse every tier and benefit below. Connect your wallet and sign in to see your eligible stake, current tier, and reward status.
>
> `Connect wallet` &nbsp; `View tier benefits`

Do not show an empty dashboard or imply that a user must connect before learning anything.

### Connected, status loading

- Keep the public tier content in place.
- Show skeletons only inside the status card.
- Say `Loading your VIP status…` and provide a retry/support route if it exceeds a defined time.

### Connected, no qualifying activity

> **Starter / Newcomer**  
> Eligible effective stake: **0 USDT**  
> Your status will appear here after qualifying activity is recorded. See what counts before participating.

Do not turn this into a pressure prompt.

### Data unavailable / wallet mismatch

> We could not load VIP status for this connected account. Check the connected wallet or try again. Your account has not been changed.

Buttons: `Retry`, `Check wallet`, `Contact support`.

### Reward unavailable

Use a reason, not a generic disabled button:

- `Pending settlement`
- `Available after [condition]`
- `Claimed on [date]`
- `Expired on [date]`
- `Not eligible under current rules`
- `Contact support` where manual fulfilment is required

## 7.9 Accessibility requirements

- Use one H1 and semantic H2/H3 section headings.
- Provide meaningful alt text for informative tier art; mark decorative section marks as decorative.
- Use real buttons for FAQ accordions, `aria-expanded`, `aria-controls`, keyboard access, and visible focus.
- Give comparison tables captions, row/column headers, and an accessible mobile alternative.
- Announce status updates to assistive technology without repeatedly interrupting the user.
- Ensure focus is trapped and returned correctly in wallet, rules, and reward modals.
- Test with keyboard-only navigation, a screen reader, zoom to 200%, high contrast, and reduced motion.

## 7.10 Text-based desktop wireframe

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ KIXLY        Sports   Esports   Activity   Support       [Wallet / Sign in] │
├─────────────────────────────────────────────────────────────────────────────┤
│ VIP AT KIXLY                                                               │
│ Track your tier, understand what counts, and see what unlocks next.        │
│ [View VIP benefits]  [Sign in to see my status]                             │
│                         [existing VIP hero artwork]                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ YOUR VIP STATUS  [signed-in state]                                         │
│ Silver        7,420 USDT eligible stake        Updated 14:32 UTC           │
│ ━━━━━━━━━━━━━━━  42,580 USDT to Gold                                      │
│ [Open Activity] [How is this calculated?] [View benefits]                  │
│ (signed-out state: explain connection + keep public content visible)       │
├─────────────────────────────────────────────────────────────────────────────┤
│ QUICK ACTIONS                                                              │
│ [Open Activity] [Eligible markets] [Benefits] [Support]                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ HOW EFFECTIVE USDT STAKE WORKS                                             │
│ Definition → formula → one bet example → parlay explanation                │
│ Counted: ...       Does not count: cancelled / void / ...                   │
│ [View full VIP rules]                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ VIP LEVELS                                                                  │
│ [Starter] [Bronze] [Silver CURRENT] [Gold NEXT] [Platinum] [Black INVITE] │
│ threshold + one-line unlock summary per card                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ COMPARE BENEFITS                                                           │
│ Benefit | Starter | Bronze | Silver | Gold | Platinum | Black              │
│ Upgrade gift     ...                                                        │
│ Birthday gift    ...                                                        │
│ Withdrawals      ...                                                        │
│ Community/events ...                                                        │
│ Red packets      amount / cadence / claim status / terms                    │
│ [Expand all terms]                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ REWARD & ACTIVITY SUMMARY [signed in]                                      │
│ Available | Pending | Claimed | Fulfilled | Expired                         │
│ [View all Activity]                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ EVENTS / COMMUNITY / VIP SERVICE                                           │
│ live event cards, eligibility, support channel, fulfilment detail           │
├─────────────────────────────────────────────────────────────────────────────┤
│ FAQ & RULES                                                                 │
│ How do I level up?  Which bets count?  How are gifts paid?  ...             │
│ [Responsible play] [Terms] [Reward rules] [Contact support]                │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 7.11 Text-based mobile wireframe

```text
┌──────────────────────────────┐
│ KIXLY              ☰  Wallet │
├──────────────────────────────┤
│ VIP AT KIXLY                  │
│ Track your tier and see what  │
│ unlocks next.                 │
│ [Sign in to see my status]    │
│ [View benefits]               │
│      VIP artwork (cropped)   │
├──────────────────────────────┤
│ YOUR STATUS                   │
│ Silver                        │
│ 7,420 USDT eligible stake     │
│ 42,580 USDT to Gold           │
│ ━━━━━━━━━━━━━  15%            │
│ Updated 14:32 UTC             │
│ [Open Activity]               │
│ [How progress works]          │
├──────────────────────────────┤
│ QUICK ACTIONS                 │
│ [Activity] [Benefits]         │
│ [Markets]  [Support]          │
├──────────────────────────────┤
│ HOW IT WORKS                  │
│ Counted / not counted         │
│ [See formula + examples  ˅]  │
├──────────────────────────────┤
│ VIP LEVELS                    │
│ [‹]  SILVER — CURRENT   [›]  │
│ 10,000 USDT threshold         │
│ 58 USDT upgrade gift*         │
│ [See all tiers]               │
├──────────────────────────────┤
│ BENEFITS                      │
│ Upgrade gift        58 USDT > │
│ Birthday gift       38 USDT > │
│ Withdrawals         Fast   >  │
│ Daily red packets   Status >  │
├──────────────────────────────┤
│ REWARDS                       │
│ Available / Pending / History │
│ [View Activity]               │
├──────────────────────────────┤
│ FAQ, RULES, RESPONSIBLE PLAY │
│ [Contact support]             │
├──────────────────────────────┤
│ [Open Activity]  (optional    │
│ sticky action, not obstructive)│
└──────────────────────────────┘
```

`*` Every numeric reward must be confirmed and linked to its terms before release.

---

# 8. Prioritized implementation roadmap

Complexity is relative to a modern web application with existing account/wallet and betting data. Dependencies are more important than the label; a “low” content fix must still wait for product/compliance sign-off.

## Phase 1 — Quick wins: make the public page understandable

| Priority | Recommendation | Expected impact | Complexity | Dependencies | Suggested success metric |
|---|---|---|---|---|---|
| P0 | Rewrite hero and CTA for value + next action; add public vs signed-in state language | High | Low | Product positioning and benefit approval | Hero CTA CTR; 5-second comprehension of “what VIP is for” improves from baseline. |
| P0 | Normalize tier names, USDT units, number formatting, and Black wording | Medium/High | Low | Content glossary; finance/compliance review | Content QA pass rate; fewer support questions about units/names. |
| P0 | Publish `How effective stake works` with formula, examples, exclusions, parlay explanation, and update cadence | High | Low/Medium | Confirmed eligibility logic and rule version | Rule-comprehension task success; reduction in “why did my bet not count?” contacts. |
| P0 | Turn the benefits table into the canonical comparison view; include every benefit listed on cards | High | Low/Medium | Benefits inventory; fulfilment owners | Benefit comprehension; tier comparison interactions; lower mismatch defects. |
| P0 | Add direct links to Activity, support, full rules, and eligible markets where those routes exist | High | Low | Stable routes and auth handling | CTA click-through; task completion from VIP to Activity/market/support. |
| P1 | Complete FAQ answers and make the accordion accessible | Medium/High | Low | Approved answers; semantic implementation | FAQ open rate; successful keyboard/screen-reader task completion. |
| P1 | Add reward labels: cash/bonus/physical/service/event; state timing and claim method | High | Medium | Reward operations and terms | “Where do I claim?” support contacts; reward claim starts/completions. |
| P1 | Run visual/responsive/accessibility/performance QA | Medium/High | Medium | Design/dev/test capacity | WCAG defects; mobile task success; LCP/INP/CLS pass rate. |
| P1 | Instrument page and account-gated events before redesign measurement | High | Low/Medium | Analytics/privacy implementation | ≥95% of required events received with correct anonymous/account-safe identifiers. |

## Phase 2 — Core membership experience: make it useful after connection

| Priority | Recommendation | Expected impact | Complexity | Dependencies | Suggested success metric |
|---|---|---|---|---|---|
| P0 | Build the signed-in status card: current tier, eligible stake, next threshold, remaining amount, timestamp | High | Medium | Membership API; wallet/account identity; error states | Status load success; sign-in-to-status completion; repeat VIP visits. |
| P0 | Add benefit availability and claim state to the member view | High | Medium | Reward service; claim/fulfilment state model | Available-to-claim rate; successful claims; lower reward-related support volume. |
| P0 | Link status to an eligible-stake/activity ledger or at least an approved explanation view | High | High | Bet-level event data and reason taxonomy | Progress explanation opens; dispute resolution time; “why count?” comprehension. |
| P1 | Add progress notifications for tier reached, reward available, and pending/expired states | Medium/High | Medium | Notification preferences and triggers | Notification open rate; claim within defined window; opt-out rate. |
| P1 | Add Black review/contact workflow with non-guarantee language | Medium | Medium | Compliance, risk, CRM, support capacity | Qualified review completion and response SLA; no increase in unsupported promises. |
| P1 | Add live events/community inventory with eligibility and fulfilment status | Medium | Medium | Operations inventory, regional rules | Event CTA engagement; attendance/fulfilment rate; benefit satisfaction. |
| P2 | Add status retention/decay explanation and warning, only if applicable | Medium | Medium | Confirmed policy; notification rules | Fewer surprise status complaints; accurate status-change acknowledgement. |

## Phase 3 — Advanced features: deepen differentiation and optimization

| Priority | Recommendation | Expected impact | Complexity | Dependencies | Suggested success metric |
|---|---|---|---|---|---|
| P1 | Add an approved next-tier calculator/simulator | Medium/High | Medium | Stable formula; responsible-play review | Calculator completion; improved threshold comprehension; no increase in unsafe activity signals. |
| P1 | Add esports-native achievement badges for healthy product milestones | Medium | Medium | Product taxonomy; badge system; moderation | Badge view/share/return rate; community participation; responsible-play guardrails. |
| P1 | Add rule/reward changelog with effective dates | Medium | Low/Medium | Versioned policy/CMS | Fewer historical-rule disputes; changelog views on release days. |
| P2 | Personalize benefit ordering based on eligibility and preferred sports/esports products | Medium | High | Consent, segmentation, reliable profile data | Benefit CTA completion vs generic control; no disproportionate exposure to high-risk prompts. |
| P2 | Build a controlled experiment program for hero, order, table/card format, and explanation modules | High | Medium | Event taxonomy, sample sizes, experimentation tooling | Lift in comprehension and task completion with no safety/support regression. |
| P2 | Create a VIP service dashboard for hosts/support teams | Medium | High | CRM/support integrations, permissions | First-response time; reward issue resolution; member satisfaction. |
| P2 | Add a wallet/account activity proof view or signed export where legally and technically appropriate | Medium | High | On-chain/off-chain data, privacy, security | Trust/verification task success; low error rate; no wallet privacy incidents. |

### What not to build first

- Leaderboards that pressure users to outspend one another.
- Animated reward effects that conceal eligibility or terms.
- New tiers before the current six-tier rules are understandable.
- A token or points currency that adds conversion math without clear user value.
- A VIP chatbot that answers rules differently from the page.
- Personalization that surfaces more wagering prompts but does not improve status or claim clarity.

---

# 9. Metrics and validation plan

## 9.1 Establish a baseline without assuming existing analytics

Run a two-week baseline if traffic is sufficient, or a minimum fixed sample of page sessions and usability participants. Use the least data necessary and follow Kixly privacy/consent requirements.

1. Add page-view and interaction events with an anonymous session ID; associate an account only after consent and sign-in.
2. Capture existing page performance from server logs/CDN and field monitoring if available.
3. Export support tickets or tag new VIP questions into categories: qualification, reward amount, claim route, wallet/sign-in, withdrawal/service, and events.
4. Conduct five to eight short task-based interviews or unmoderated tests before changing copy. Ask participants to find: current/next tier, what counts, first reward, claim route, and Black path.
5. Record mobile and desktop task completion separately.
6. Do not use total wagering as the sole success metric. A successful VIP page should improve understanding, claim completion, trust, and safe navigation—not simply push users to wager more.

## 9.2 Recommended event taxonomy

```text
vip_page_view
vip_mode_detected_public | vip_mode_detected_member
vip_hero_cta_click
vip_wallet_connect_start | vip_wallet_connect_success | vip_wallet_connect_error
vip_sign_in_start | vip_sign_in_success | vip_sign_in_error
vip_status_load_success | vip_status_load_error
vip_progress_explanation_open
vip_rules_open
vip_tier_select | vip_tier_compare_open
vip_benefit_open
vip_activity_click
vip_eligible_markets_click
vip_support_click
vip_reward_claim_start | vip_reward_claim_success | vip_reward_claim_error
vip_faq_open
vip_scroll_50 | vip_scroll_90
vip_mobile_overflow_error
```

Never send a raw wallet address to analytics unless explicitly required, approved, and protected. Prefer a pseudonymous account/session identifier.

## 9.3 KPI framework

| KPI | Definition | Why it matters | Suggested guardrail/target direction |
|---|---|---|---|
| VIP page engagement | Qualified page sessions, scroll depth, time with content visible | Establish whether the page is discovered and read | Increase quality engagement, not time caused by confusion. |
| Hero CTA CTR | Clicks on status, benefits, or connection CTA / qualified sessions | Tests whether the first action is understandable | Compare public vs member state; no target until baseline. |
| Status activation rate | Successful status load / signed-in VIP-page sessions | Measures core product value | Improve toward reliable majority; monitor errors separately. |
| Progress explanation interaction | Users opening formula/ledger / member sessions | Indicates demand for transparency | High interaction is not failure; use comprehension outcome. |
| Benefit comprehension | % who correctly identify current/next tier, amount, timing, and claim route in test | Direct UX outcome | Target ≥80% correct in moderated/unmoderated task sample. |
| Claim completion | Successful reward claims / rewards available | Measures whether benefits are usable | Increase without increasing claim errors or support contacts. |
| Reward visibility | Available/pending rewards viewed / eligible members | Measures status clarity | Increase view and timely claim; track expired rewards. |
| Return visits | 7-day and 30-day returning VIP-page members | Measures ongoing utility | Increase only with useful status updates, not spam. |
| Membership activation/conversion | New or existing users who reach an approved membership milestone / relevant cohort | Business outcome if applicable | Pair with safety/compliance and not only wagering amount. |
| Support efficiency | VIP qualification/claim contacts per 1,000 page sessions; median resolution time | Detects unclear rules | Decrease repetitive questions and resolution time. |
| Mobile usability | Task completion, tap error rate, table use, wallet return rate by device | Mobile is a high-risk friction point | No material mobile gap versus desktop. |
| Performance | LCP, INP, CLS, JS errors, hero image transfer size | Slow pages reduce trust and conversion | Aim for representative Core Web Vitals thresholds. |
| Accessibility | Automated violations plus keyboard/screen-reader task success | Inclusive access and compliance | Zero critical issues; all core tasks complete without pointer. |
| Safety guardrails | Visits/clicks to limits, cooling-off, support/self-exclusion; unsafe prompt exposure | Prevents VIP from becoming a pressure tool | No increase in unsafe behavior or policy incidents after redesign. |

## 9.4 Experiment plan

### Experiment 1 — Hero copy

- **Control:** Current `VIP membership / Six tiers, rising with you`.
- **Variant:** `Track your tier, understand what counts, and see what unlocks next.`
- **Primary metric:** Correct comprehension in an intercept or task test plus hero CTA CTR.
- **Guardrails:** No increase in support questions, wallet errors, or unsafe wagering prompts.

### Experiment 2 — Tier cards plus comparison table vs table-first

- **Primary metric:** Time and success to answer “What do I get at Silver?” and “What changes at Gold?”
- **Guardrail:** Mobile scroll/overflow errors.

### Experiment 3 — Progress explanation placement

- **Control:** Rules text below tier cards.
- **Variant:** `How progress works` immediately beside the member progress number.
- **Primary metric:** Progress dispute contacts and explanation comprehension.

### Experiment 4 — Activity CTA

- **Control:** Text-only mention of Activity.
- **Variant:** contextual `Open Activity` deep link with reward filter.
- **Primary metric:** Reward claim completion and time from benefit availability to claim.

For all experiments: randomize by account or stable anonymous cohort, avoid exposing one member to contradictory reward rules, pre-register the primary metric, and run long enough to cover weekday/weekend sports behavior. If traffic is low, use sequential usability tests and pre/post analysis instead of pretending a small A/B test is conclusive.

---

# 10. Final strategic recommendations

## 10.1 Five biggest weaknesses or opportunities on the current page

1. **Turn a catalog into a member tool.** The current page lists tiers; the strategic opportunity is to show a member’s current state, next state, benefits now, and claim status.
2. **Make effective stake auditable.** The phrase is central to progression but not yet a user-facing calculation model.
3. **Unify reward information.** Cards, table, red packets, and disclaimer should come from one benefits/rules source of truth.
4. **Make support and activity actionable.** Every service or reward claim should have a route, state, and expectation.
5. **Differentiate through sports/prediction-market clarity.** Do not compete with casinos solely on cashback language or high-roller theatrics; make Kixly the clearest place to understand progress and membership value around sports/esports markets.

## 10.2 Five most valuable changes to implement first

1. **Hero and state redesign:** public explainer plus member status card.
2. **Effective-stake explainer:** formula, examples, exclusions, parlay treatment, timestamp, and rules link.
3. **Canonical benefit matrix:** every tier, every benefit, amount/type, timing, claim route, and terms.
4. **Activity/support navigation:** deep links for red packets, reward history, eligible markets, and VIP support.
5. **Content/accessibility/measurement QA:** normalize language, complete FAQs, test mobile and assistive tech, instrument core events.

## 10.3 Three competitor-inspired ideas worth adapting

1. **Prediction-market transparency from Polymarket:** publish the calculation, time window, update cadence, and edge cases; do not make users infer the model.
2. **Reward lifecycle from Kalshi and historical Rollbit:** display progress, pending/available/claimed/expired states, and link directly to Activity.
3. **Esports progression from Thunderpick:** use clear units and frequent, meaningful milestones or badges where they help users understand progress; avoid copying the economics or incentivizing unsafe volume.

## 10.4 Three ways Kixly can differentiate

1. **The most explainable VIP program in sports prediction:** an eligible-stake ledger and “why did this count?” explanation can become a trust advantage.
2. **Sports/esports-native membership:** match/event language, community access, ticket draws, and achievement moments should feel like part of fandom and prediction—not a casino reskin.
3. **Wallet-aware but human-readable:** show the relationship between wallet, account, stake, rewards, and Activity without blockchain jargon or opaque support handoffs.

## 10.5 Recommended MVP without excessive development

**MVP scope:**

- Content and information-architecture rewrite.
- Existing six levels and published values preserved pending confirmation.
- Plain-language formula/rules block.
- Accessible tier comparison table.
- Public signed-out mode and clear connection explanation.
- Member status card using existing membership data.
- Benefit status fields with links to Activity or support.
- Complete FAQ and terms/responsible-play links.
- Responsive and accessibility QA.
- Analytics events and a baseline usability test.

**Explicitly defer:** new rewards, new tiers, leaderboards, complex gamification, status transfer, AI support, and personalization until the current calculation and reward data are reliable.

## 10.6 Presentation-ready executive summary

> Kixly’s VIP page has a solid factual foundation: six public levels, thresholds, published gift amounts, exclusions, a benefit table, and a sign-in route. The problem is that it currently behaves more like a static brochure than a membership product. Users can see that VIP exists, but they cannot yet easily answer the questions that drive trust and action: how their effective stake was calculated, what tier they are in, what is next, which benefits are available, when rewards are paid, and where to claim them.
>
> Competitors provide three clear lessons. Stake makes tier progression scannable; Polymarket makes volume rules and time windows explainable; Kalshi makes reward progress and claims actionable. Thunderpick shows how an esports-native progression layer can feel like a product rather than a generic casino VIP scheme. Kixly should adapt these mechanics without copying their economics.
>
> The recommended MVP is a public explainer plus signed-in status dashboard: current tier, eligible stake, next threshold, remaining amount, last update, benefit availability, and Activity links. Pair this with a canonical benefits table, a formula/rules explainer, completed FAQs, mobile/accessibility QA, and analytics. That sequence is high impact, measurable, and does not require Kixly to invent new rewards or overbuild the loyalty system.

---

# Appendix A — Research source register

All sources below were accessed or attempted on **10 October 2026 UTC**. Official pages are preferred. Historical, unavailable, and account-gated sources are explicitly labelled.

| Source | Use in report | Evidence status |
|---|---|---|
| [Kixly VIP](https://kixly.co/vip) | Primary page audit: tiers, thresholds, benefits, exclusions, FAQs, sign-in proposition | Current public page; account-gated/interactive behavior not verified |
| [Kixly home](https://kixly.co/) | Wallet/sign-in context and Privy reference | Current public page; click flow not verified |
| [Stake VIP Club](https://stake.com/vip-club) | Tier ladder, public thresholds, benefit progression, host model | Current official public page; regional availability may vary |
| [Cloudbet VIP Club](https://www.cloudbet.com/en/lp/vip-club) | Hero/CTA, VIP transfer, calculator positioning, service benefits, public tier table, FAQ | Current official public page; internal tier-copy inconsistency noted |
| [BC.Game VIP Club](https://bc.game/vip-detail) | Benefit-led page, VIP transfer, FAQ, activity/loyalty/no-barriers framing, responsible gaming footer | Current official public page; numerical qualification not exposed |
| [Thunderpick Rewards Program](https://thunderpick.io/blog/new-thunderpick-rewards-program) | XP, ranks/sub-levels, automatic rewards, no-decay announcement, quests/badges | Official 2025 announcement; rollout status of announced items requires verification |
| [Thunderpick current home](https://thunderpick.io/) | Current Rewards, Giveaways, Races, and Thunder VIP Club navigation references | Current public page; account-gated details not verified |
| [Polymarket Taker Rebate documentation](https://docs.polymarket.com/programs/taker-rebates) | Formula, weighted volume, 30-day window, profile tier, payout/update rules, edge cases | Current official documentation; not a Kixly program |
| [Kalshi Referral Program FAQ](https://help.kalshi.com/en/articles/13823783-kalshi-referral-program-faq) | Reward progress card, offer requirements, deadlines, claim flow, Activity history | Current official help page; not a VIP-tier program |
| [Rollbit Rewards Breakdown](https://blog.rollbit.com/rollbit-rewards-breakdown/) | Historical level/reward dashboard reference | Official article explicitly marked outdated |
| [Rollbit Rewards Calendar](https://blog.rollbit.com/rollbit-rewards-rewards-calendar/) | Historical calendar/pending reward UX reference | Official 2023 article; not current evidence |
| [Rollbit current response](https://rollbit.com/blocked) | Current access limitation during research | Page states unavailable in this country; current VIP mechanics not treated as verified |
| [Rivalry operational status](https://www.rivalry.com/operationally-closed) | Research hygiene and removal from active competitor set | Official page states operations have ceased |

## Appendix B — Visual reference links

These are direct visual/page references for a team workshop. They are not screenshots of Kixly’s connected-account state.

| Reference | Link | What to inspect |
|---|---|---|
| Kixly VIP hero | [hero image](https://kixly.co/_next/image?url=%2Fbrand%2Fvip%2Fhero-roulette.webp&w=3840&q=75) | Image treatment, overlay contrast, and whether roulette imagery is intentional for a sports/esports brand |
| Kixly tier artwork | [Bronze](https://kixly.co/brand/vip/raised/bronze.png), [Silver](https://kixly.co/brand/vip/raised/silver.png), [Gold](https://kixly.co/brand/vip/raised/gold.png), [Platinum](https://kixly.co/brand/vip/raised/platinum.png), [Black](https://kixly.co/brand/vip/raised/black.png) | Preserve brand recognition while reducing information density and relying on text for meaning |
| Stake VIP hero asset | [trophy image](https://stake.com/_app/immutable/assets/vip-header-trophy.DaCsPcsl.webp) | How a hero transitions quickly into threshold/benefit cards |
| Cloudbet VIP landing visual | [VIP landscape](https://cdn.prod.website-files.com/6659430ddebf16a696c96358/671194937656beb9f9cfb6c3_VIP%20Landscape-fade.avif) | Service-led premium composition and CTA placement |
| Thunderpick rewards visual | [2025 rewards image](https://thunderpick.io/blog/wp-content/uploads/2025/06/860x483-Blog-Image.jpg) | Esports/game-rank visual language; use as inspiration, not a Kixly copy target |
| Kalshi reward-flow visual | [official FAQ with animated examples](https://help.kalshi.com/en/articles/13823783-kalshi-referral-program-faq) | Progress card, “See all steps,” unlock, and Activity flow |

## Appendix C — Product-team decisions required before design sign-off

1. Is effective stake lifetime cumulative, rolling, or another window?
2. What exactly is the parlay acceleration rule?
3. What is the amount and logic of daily red packets/level rebate?
4. What are the payout/claim/expiry rules for upgrade and birthday gifts?
5. Which benefits are available by region, product, account risk status, and inventory?
6. What is the wallet/account identity model for VIP status?
7. Does status decay or remain after inactivity?
8. What does each withdrawal/support promise mean operationally?
9. Is there a Black review path, and who owns it?
10. Which responsible-play, age, jurisdiction, and promotional disclosures are required on this page?

Until these decisions are answered, design should use clearly labelled placeholders and should not imply benefits or calculations that the backend cannot support.
