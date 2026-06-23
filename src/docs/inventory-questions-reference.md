# Smart Inventory — Questions, Answers & Custom Fields Reference

> Generated 2026-06-23. This document covers every inventory/reflection flow in the app, the questions each one asks, the answer formats, and all custom user/entity fields.

---

## Table of Contents

1. [Nightly Inventory (AA / Recovery Mode)](#1-nightly-inventory-aa--recovery-mode)
2. [Daily Reflection (General Mode)](#2-daily-reflection-general-mode)
3. [Spot Check Inventory](#3-spot-check-inventory)
4. [Gratitude & Affirmations](#4-gratitude--affirmations)
5. [Journal Entry](#5-journal-entry)
6. [User Entity — Custom Fields](#6-user-entity--custom-fields)
7. [UserQuestionSettings Entity — Customization](#7-userquestionsettings-entity--customization)
8. [InventoryEntry Entity](#8-inventoryentry-entity)
9. [GratitudeEntry Entity](#9-gratitudeentry-entity)
10. [SpotCheckEntry Entity](#10-spotcheckentry-entity)
11. [JournalEntry Entity](#11-journalentry-entity)
12. [Answer Types Explained](#12-answer-types-explained)

---

## 1. Nightly Inventory (AA / Recovery Mode)

Shown when `user.recovery_status === 'aa'`.

### Required Questions

| # | ID | Question | Description | Type |
|---|----|----------|-------------|------|
| 1 | `resentful` | Were You Resentful or Angry Today? | Notice any people, situations, or thoughts you replayed in your mind that disturbed your peace or kept you emotionally stuck. | `yesno-text` |
| 2 | `dishonest` | Were You Dishonest in Any Way Today? | Look at what you said, what you avoided saying, and how you may have presented yourself in a way that was not fully truthful. | `yesno-text` |
| 3 | `selfish` | Were You Selfish or Self-Centered Today? | Reflect on where you put your comfort, control, image, or personal agenda ahead of honesty, fairness, or connection. | `yesno-text` |
| 4 | `fearful` | Were You Fearful or Anxious Today? | Reflect on where fear or anxiety showed up today, particularly around rejection, abandonment, failure, loss of control, security, or not being enough, and how those fears influenced your thoughts, emotions, or actions. | `yesno-text` |
| 5 | `harmful` | Did You Harm Anyone Today? Do You Owe an Apology? | Consider whether your words, actions, or omissions caused harm, discomfort, or confusion for someone else. | `yesno-text` |
| 6 | `secret` | Did You Keep a Secret or Withhold the Truth from Someone? | Since keeping secrets builds shame and isolation, reflect on any secrets, shame, rationalizations, or justifications that you had throughout the day. | `yesno-text` |
| 7 | `unkind` | Were You Kind And Loving Toward All Today? | Observe moments where you were impatient, irritable, dismissive, cold, selfish or emotionally unavailable. | `yesno-text-no` |
| 8 | `do_well` | What Did You Do Well Today? | Reflect on what you handled properly today, especially in situations where you normally would have acted from fear, ego, or old patterns. | `yesno-text` |
| 9 | `better` | Is There Anything That You Could Have Done Better Today? | Reflect on whether you could have handled something better today to see if there was room for growth or a better choice. | `yesno-text` |
| 10 | `gratitude` | Gratitudes | _(no description)_ | `gratitude` |

### Optional Questions (can be toggled on/off by the user)

| # | ID | Question | Description | Type |
|---|----|----------|-------------|------|
| 11 | `avoidance` | Did You Avoid Anything You Needed to Face Today? | Look at where you procrastinated, avoided conflict, avoided honesty, avoided vulnerability, or stayed in comfort instead of growth. | `yesno-text` |
| 12 | `authentic` | Were You Authentic Today? | Reflect on whether you showed up as your real self, or whether you performed, people-pleased, manipulated, hid your feelings, or tried to control how others saw you. | `yesno-text` |
| 13 | `boundaries` | Did You Respect Your Boundaries and Other People's Boundaries Today? | Reflect on whether you said yes when you meant no, overgave, overcontrolled, crossed boundaries, or allowed resentment to build by not being honest. | `yesno-text` |
| 14 | `present` | Were You Present Today? | Reflect on whether you lived in the moment or escaped into distractions, fantasy, overthinking, social media, validation seeking, or future-tripping. | `yesno-text` |
| 15 | `surrender` | What Did You Need to Let Go of Today? | Step 10 requires surrender. Reflect on what you tried to control, obsess over, or cling to, and what you may need to release to stay spiritually free. | `yesno-text` |
| 16 | `prayer` | Did You Take Time for Prayer or Meditation Today? | Step 10 encourages continued spiritual practice. Reflect on whether you connected to a Higher Power, practiced mindfulness, or grounded yourself spiritually. | `yesno-text` |
| 17 | `triggers` | What Triggered You Today? | Reflect on situations or people that activated you emotionally. Look for patterns where you reacted from old wounds, insecurities, or ego. | `yesno-text` |
| 18 | `lesson` | What Was the Biggest Lesson You Learned Today? | Step 10 is about growth through awareness. Reflect on what today taught you about yourself, your recovery, your relationships, or your character defects. | `yesno-text` |
| 19 | `tomorrow` | What Intention Do You Want to Set for Tomorrow? | Choose one simple intention to carry forward into tomorrow. This creates momentum and keeps you focused on progress instead of perfection. | `yesno-text` |
| 20 | `service` | Were You of Service Today? | Step 10 is strengthened through service. Reflect on whether you helped someone, supported someone emotionally, showed kindness, or contributed to someone else's well-being without expecting anything in return. | `yesno-text` |

---

## 2. Daily Reflection (General Mode)

Shown when `user.recovery_status === 'general'`.

| # | ID | Question | Type |
|---|----|----------|------|
| 1 | `emotions` | What Emotions Did You Feel Most Strongly Today? | `text` |
| 2 | `challenged` | What Challenged You Today? | `text` |
| 3 | `well` | What Did You Do Well Today? | `text` |
| 4 | `alignment` | Did You Act Out of Alignment With Your Values? If So, Explain. | `yesno-text` |
| 5 | `avoided` | Did You Avoid Anything Important Today? | `yesno-text` |
| 6 | `joy` | Who or What Brought You Joy Today? | `text` |
| 7 | `gratitude` | What Are You Grateful for Today? | `gratitude` |

---

## 3. Spot Check Inventory

A quick, real-time check-in available from the Dashboard's "Spiritual Toolkit."

| # | ID | Question | Description | Type |
|---|----|----------|-------------|------|
| 1 | `resentful` | Am I Resentful or Angry Right Now? | Check in honestly. Is there anyone or anything disturbing your peace right now? | `yesno-text` |
| 2 | `fearful` | Am I Fearful or Anxious Right Now? | Notice any worry, dread, or unease in your body or mind right now. | `yesno-text` |
| 3 | `selfish` | Am I Being Selfish or Self-Centered Right Now? | Am I making this about me? Am I seeking to control, manipulate, or get my way? | `yesno-text` |
| 4 | `dishonest` | Am I Being Dishonest in Any Way Right Now? | With others or with myself. Am I pretending, hiding, or avoiding something? | `yesno-text` |
| 5 | `letting_go` | What Do I Need to Let Go of Right Now? | Name it. A thought, feeling, expectation, or need for control. | `text` |
| 6 | `action` | What Is One Action I Can Take Right Now to Restore My Peace? | A prayer, a call, an amend, a walk — something small and concrete. | `text` |

---

## 4. Gratitude & Affirmations

A daily practice available from the Dashboard's "Spiritual Toolkit."

| # | ID | Question | Description | Type |
|---|----|----------|-------------|------|
| 1 | `gratitude` | What Are You Grateful For Today? | List at least 5 things — big or small. Gratitude shifts your energy and opens your heart. | `gratitude` |
| 2 | `affirmations` | Write Your Affirmations for Today | Write positive, present-tense statements about who you are and who you're becoming. E.g. "I am enough. I am loved. I am at peace." | `text` |
| 3 | `gift` | What Is One Gift or Blessing You Often Take for Granted? | Slow down and notice something you might overlook — your health, a relationship, a simple comfort. | `text` |
| 4 | `intention` | What Is Your Intention for Today? | Set one clear, positive intention to carry with you. How do you want to show up today? | `text` |

---

## 5. Journal Entry

Users can optionally journal after completing a nightly inventory. The journal entry links to the inventory and supports photo upload with AI transcription.

| Field | Description |
|-------|-------------|
| `date` | Date of the journal entry |
| `inventory_id` | ID of the related inventory entry |
| `prompts_answered` | JSON object containing prompt responses |
| `photo_url` | URL of uploaded handwritten journal photo |
| `transcription` | AI transcription of handwritten journal |
| `emotional_analysis` | AI-generated emotional state analysis (object, includes `overall_mood`) |

---

## 6. User Entity — Custom Fields

The built-in User entity with all custom fields:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `display_name` | string | _(required)_ | User's preferred display name |
| `profile_picture` | string | _(required)_ | Profile picture URL |
| `recovery_status` | enum: `aa`, `general` | _(required)_ | `aa` = person in recovery (shows recovery/AA-style tools and reflections); `general` = not in recovery (neutral self-reflection tools, no recovery language) |
| `reminder_enabled` | boolean | `true` | Enable daily reminder notifications |
| `reminder_time` | string | `"21:00"` | Time for daily reminder (HH:MM) |
| `theme_color` | string | `"purple"` | App theme color |
| `background` | string | _(required)_ | Background type/style |
| `streak` | integer | `0` | Current reflection streak count |
| `mood_check_enabled` | boolean | `true` | Enable daily mood check-in popup |
| `last_mood_check` | string | — | Date of last mood check-in |
| `last_mood` | string | — | Last recorded mood |
| `sober_date` | date | — | Recovery/sobriety start date. Used to display a days-sober (or days-since) counter on the dashboard. Optional. |
| `milestone_label` | string | — | Custom label for the sober_date counter, e.g. "Sober", "Clean", "Days since I started". Defaults to a neutral label for general users. |
| `onboarding_completed` | boolean | `false` | Whether the user has finished the onboarding flow |
| `plan` | enum: `free`, `pro`, `lifetime` | `"free"` | Current plan tier, denormalized from Subscription for fast gating |
| `subscription_status` | enum: `none`, `trialing`, `active`, `past_due`, `canceled` | `"none"` | Denormalized subscription state for fast gating |
| `trial_ends` | date-time | — | When the user's free trial ends |
| `last_active` | date-time | — | Last time the user opened the app, for admin analytics |
| `signup_platform` | enum: `web`, `ios`, `android` | `"web"` | Platform the user signed up on |

### Built-in fields (managed by platform, not editable)

| Field | Description |
|-------|-------------|
| `id` | Unique user ID |
| `created_date` | Account creation timestamp |
| `full_name` | Full name from auth provider |
| `email` | Email address |
| `role` | `admin` or `user` |

---

## 7. UserQuestionSettings Entity — Customization

Allows users to customize which questions appear, in what order, and add their own custom questions.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `inventory_type` | enum: `aa`, `general` | ✅ | Type of inventory these settings apply to |
| `customization_enabled` | boolean | — | Whether custom question settings are active (default `false`) |
| `enabled_questions` | array of strings | ✅ | Array of question IDs that are enabled |
| `question_order` | array of strings | ✅ | Ordered array of question IDs |
| `custom_questions` | array of objects | — | User's custom questions (see below) |

### Custom Question Object Structure

```json
{
  "id": "string",
  "question": "string",
  "description": "string",
  "type": "string"
}
```

### How Customization Works

1. If `customization_enabled` is `true` AND `question_order` AND `enabled_questions` are populated, the app uses the custom set instead of defaults.
2. Questions are ordered according to `question_order`, filtered to only those in `enabled_questions`.
3. Any `custom_questions` are appended after the standard questions.
4. If the custom set is empty or invalid, the app falls back to default questions.

---

## 8. InventoryEntry Entity

Stores completed nightly inventory / daily reflection entries.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | date | ✅ | Date of the inventory |
| `inventory_type` | enum: `aa`, `general` | ✅ | Type of inventory taken |
| `responses` | object | ✅ | JSON object containing all question responses (keyed by question ID) |
| `reflective_summary` | string | — | AI-generated reflective summary HTML |
| `journaling_prompts` | string | — | AI-generated journaling prompts HTML |
| `share_text` | string | — | Formatted text for sharing |

### Response Object Structure

Each response is keyed by the question ID:

```json
{
  "resentful": {
    "value": true,
    "details": "I was annoyed at my coworker during the meeting..."
  },
  "gratitude": {
    "value": ["My family", "Good coffee", "Sunshine", "Health", "My dog"]
  }
}
```

---

## 9. GratitudeEntry Entity

Stores completed Gratitude & Affirmations sessions.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | date | ✅ | Date of the entry |
| `responses` | object | ✅ | JSON object containing all responses (keyed by question ID) |
| `ai_reflection` | string | — | AI-generated reflection on gratitudes and affirmations |

---

## 10. SpotCheckEntry Entity

Stores completed Spot Check sessions.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | date | ✅ | Date of the spot check |
| `time` | string | — | Time of the spot check (HH:MM) |
| `responses` | object | ✅ | JSON object containing all responses (keyed by question ID) |
| `ai_reflection` | string | — | AI-generated brief insight |

---

## 11. JournalEntry Entity

Stores journal entries linked to inventory entries.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | date | ✅ | Date of the journal entry |
| `inventory_id` | string | ✅ | Related inventory entry ID |
| `prompts_answered` | object | — | JSON object containing prompt responses |
| `photo_url` | string | — | URL of uploaded handwritten journal photo |
| `transcription` | string | — | AI transcription of handwritten journal |
| `emotional_analysis` | object | — | AI-generated emotional state analysis (includes `overall_mood`) |

---

## 12. Answer Types Explained

| Type | What It Means | UI Behavior |
|------|---------------|-------------|
| `yesno-text` | Yes/No question with optional text elaboration | Shows Yes/No buttons; if "Yes" (or any answer), a textarea appears for details |
| `yesno-text-no` | Yes/No question where "No" triggers text elaboration | Shows Yes/No buttons; if "No", a textarea appears for details (used when "No" means there's something to reflect on) |
| `text` | Free-text answer | Shows a textarea only |
| `gratitude` | List of gratitude items | Shows an add-item interface where users can list multiple gratitude entries |

---

*End of reference document.*