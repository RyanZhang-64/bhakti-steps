# Bhakti Steps

A React Native (Expo) spiritual progress tracking app for ISKCON London. Track sadhana, seva, book distribution, and courses across Mentee, Mentor, and Admin roles.

## Prerequisites

- **Node.js** 18 or later — [download here](https://nodejs.org/)
- **Expo Go** app on your phone — [iOS App Store](https://apps.apple.com/app/expo-go/id982107779) | [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Run the Demo on Your Phone

1. **Clone the repo and install dependencies**

   ```bash
   git clone https://github.com/RyanZhang-64/bhakti-steps.git
   cd bhakti-steps
   npm install
   ```

2. **Start the dev server**

   ```bash
   npx expo start
   ```

3. **Open on your phone**

   - A QR code will appear in the terminal.
   - **Android** — Open the Expo Go app and tap "Scan QR code".
   - **iPhone** — Open your Camera app and point it at the QR code. Tap the Expo banner that appears.
   - Make sure your phone and computer are on the **same Wi-Fi network**.

4. **If Wi-Fi doesn't work** (e.g. corporate/university network blocking traffic)

   ```bash
   npx expo start --tunnel
   ```
   This routes traffic through an Expo tunnel so the QR code works even across different networks. You may be prompted to install `@expo/ngrok` — accept the install.

> **Tip:** The first load takes a moment while the JavaScript bundle is built. Subsequent reloads are faster.

## Demo Sign-In Accounts

The app opens to a sign-in screen. Use these credentials to explore different roles (password for all: `bhakti123`):

| Role | Email | What you'll see |
|------|-------|-----------------|
| **Mentee** | `john@example.com` | Sadhana form, progress charts, seva & books, profile |
| **Mentor** | `syama@example.com` | Dashboard, batches, mentee drill-down, approvals |
| **Admin** | `govinda@iskcon.london` | KPI dashboard, user management, batch oversight, settings |
| **Mentor + Admin** | `prabhava@iskcon.london` | Dual-role account — switch between Mentor and Admin via the header toggle |

> **Note:** The account `radha@example.com` is intentionally set to "pending" status to demonstrate the approval flow — signing in will show a pending message.

Each role has its own tab navigation. Mentor and Admin roles support drill-down navigation (e.g. Dashboard → Batch → Mentee).

## Running on Emulators/Simulators (Optional)

If you prefer to use an emulator instead of a physical phone:

```bash
# iOS Simulator (macOS only, requires Xcode)
npx expo start --ios

# Android Emulator (requires Android Studio)
npx expo start --android
```

## Project Structure

```
├── App.js                 # Entry point with role switching
├── app.json               # Expo configuration
├── assets/fonts/          # DM Sans + Source Serif 4 font files
├── src/
│   ├── theme.js           # Design tokens (colors, spacing, typography)
│   ├── ThemeContext.js     # Theme provider
│   ├── mockData.js        # Mock data for all roles
│   ├── components/        # Reusable UI components
│   └── screens/           # Role-specific screen sets
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| QR code won't connect | Ensure phone and computer are on the same Wi-Fi, or use `--tunnel` mode |
| `expo: command not found` | Run `npm install` first — Expo is a project dependency |
| Fonts look wrong / fallback fonts | The required font files are already in `assets/fonts/`. If you see fallback fonts, try restarting the dev server |
| Red error screen on phone | Read the error message — usually a missing dependency. Run `npm install` and reload |
| Slow first load | Normal — the JS bundle is being built. Subsequent reloads are faster |

## Notes

- All data is mocked — no backend required
- Haptic feedback works on physical devices (not simulators)
- Built with Expo SDK 54, React Native 0.81

---

## AWS Console Backend Deployment — No CLI, No IAM Users

### Context

User cannot create IAM users in their AWS account, so the Amplify CLI cannot be used. However, they have full console access to all AWS services. This plan sets up the same backend (Cognito + AppSync + DynamoDB) entirely through the AWS Console UI. The app already has all the code wired up — just needs the infrastructure created and a config file pointed at it.

### Pre-existing Code (no changes needed unless noted)

- `amplify/backend/api/bhaktisteps/schema.graphql` — 15 models, 14 GSIs, full auth rules
- `src/api/client.js` — GraphQL client with mock fallback
- `src/api/auth.js` — Cognito auth with mock fallback (needs 1 fix)
- `scripts/seed.js` — Seeds reference data via AppSync
- `App.js` lines 10-12 — Amplify init, currently commented out

### Phase 1: Cognito User Pool

#### 1.1 Create User Pool (Console > Cognito > Create user pool)

- Sign-in: Email only
- Password policy: defaults (8 chars, upper+lower+number+special)
- MFA: No MFA
- Recovery: Email only
- Self-registration: Enabled
- Required attributes: email, given\_name
- Email: Send with Cognito (free tier, 50/day)
- Pool name: `bhakti-steps-userpool`
- App client name: `bhakti-steps-app`
- No client secret (React Native can't store it securely)
- Auth flows: `ALLOW_USER_SRP_AUTH`, `ALLOW_REFRESH_TOKEN_AUTH`
- **Record:** User Pool ID + App Client ID

#### 1.2 Create Groups (User Pool > Groups tab)

| Group   | Precedence |
|---------|------------|
| admin   | 1          |
| mentor  | 2          |
| mentee  | 3          |

Lower precedence = higher priority when user has multiple groups.

### Phase 2: AppSync + DynamoDB

#### 2.1 Create AppSync API (Console > AppSync > Create API)

- Type: GraphQL, design from scratch
- Name: `bhakti-steps-api`
- Primary auth: Amazon Cognito User Pool > select your pool
- Default action: ALLOW
- **Record:** GraphQL endpoint URL + API ID

#### 2.2 Convert & Import Schema

The existing `schema.graphql` uses Amplify directives (`@model`, `@auth`, `@index`, etc.) which AppSync doesn't understand natively. Must convert to plain AppSync SDL:

- Strip all `@` directives from types
- Define `CreateXInput`, `UpdateXInput`, `DeleteXInput` for each model
- Define `XConnection { items: [X], nextToken: String }` for each model
- Define all Query fields: `getX(id: ID!): X`, `listXs(...): XConnection`
- Define 14 custom query fields for GSI lookups
- Define all Mutation fields: `createX`, `updateX`, `deleteX` per model
- Add `ModelStringKeyConditionInput` for sort-key range queries
- Keep enums as-is

A converted schema file will be generated as a deliverable.

#### 2.3 Create DynamoDB Tables + Basic Resolvers

For each of the 15 types, use AppSync Schema editor > Create Resources:

- Select the type > auto-creates DynamoDB table, data source, and CRUD resolvers
- Table naming: `{Type}-bhaktisteps`
- Primary key: `id` (String), Billing: On-demand

#### 2.4 Create GSIs (DynamoDB > each table > Indexes tab)

| Table               | GSI         | Partition Key | Sort Key   |
|---------------------|-------------|---------------|------------|
| User                | byEmail     | email         | --         |
| User                | byMentor    | mentorId      | --         |
| SadhanaEntry        | byUserDate  | userId        | date       |
| SevaLog             | byUser      | userId        | --         |
| BookProgress        | byUser      | userId        | --         |
| CourseCompletion    | byUser      | userId        | --         |
| Batch               | byMentor    | mentorId      | --         |
| BatchMember         | byBatch     | batchId       | --         |
| BatchMember         | byUser      | userId        | --         |
| BatchSession        | byBatch     | batchId       | date       |
| SessionAttendance   | bySession   | sessionId     | --         |
| MentorNote          | byMentee    | menteeId      | createdAt  |
| AuditLog            | byDate      | date          | --         |
| ReferenceItem       | byCategory  | category      | --         |

#### 2.5 Attach Resolvers for GSI Queries

For each custom query, attach a DynamoDB Query resolver against the named GSI with standard `{ items, nextToken }` response mapping.

#### 2.6 Auth in Resolvers (MVP)

Start permissive — Cognito auth at API level rejects unauthenticated calls. Add owner/group checks incrementally.

### Phase 3: First Admin User

#### 3.1 Create in Cognito (Users > Create user)

Email: your admin email, temporary password, mark email verified

#### 3.2 Add to admin group

#### 3.3 Set permanent password via CloudShell (no IAM needed)

```bash
aws cognito-idp admin-set-user-password \
  --user-pool-id eu-west-2_XXXXX \
  --username admin@example.com \
  --password "YourP@ssword1" \
  --permanent
```

#### 3.4 Verify in AppSync Queries editor

### Phase 4: Connect the App

#### 4.1 Create `src/amplifyconfiguration.json`

```json
{
  "aws_project_region": "eu-west-2",
  "aws_cognito_region": "eu-west-2",
  "aws_user_pools_id": "eu-west-2_XXXXXXXXX",
  "aws_user_pools_web_client_id": "XXXXXXXXXXXXXXXXXXXXXXXXXX",
  "aws_appsync_graphqlEndpoint": "https://XXXXX.appsync-api.eu-west-2.amazonaws.com/graphql",
  "aws_appsync_region": "eu-west-2",
  "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS"
}
```

#### 4.2 Uncomment `App.js` lines 10-12

#### 4.3 Fix `src/api/auth.js:26-30` — add `NEW_PASSWORD_REQUIRED` handling

### Phase 5: Seed Data

1. Add temporary API key auth to AppSync (7 day expiry)
2. Add key to config, run `node scripts/seed.js`
3. Remove API key after seeding

### Code Changes Summary

| File                                                    | Change                                        |
|---------------------------------------------------------|-----------------------------------------------|
| `App.js:10-12`                                          | Uncomment 3 Amplify lines                     |
| `src/amplifyconfiguration.json`                         | Create with collected AWS values               |
| `src/api/auth.js:26-30`                                 | Add `NEW_PASSWORD_REQUIRED` challenge handling |
| `amplify/backend/api/bhaktisteps/schema-appsync.graphql`| Generate converted plain-SDL schema            |

### Verification

- Admin signs in via the app
- Register a mentee > appears in Cognito
- Mentee submits sadhana > appears in DynamoDB
- Mentor sees mentee data
- Seeded reference data visible in app
- All 14 custom queries work in AppSync