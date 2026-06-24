import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = user.id;
    const email = user.email;

    // Delete all user-owned entities using service role (handles admin-only RLS entities)
    await base44.asServiceRole.entities.InventoryEntry.deleteMany({ created_by_id: userId });
    await base44.asServiceRole.entities.SpotCheckEntry.deleteMany({ created_by_id: userId });
    await base44.asServiceRole.entities.GratitudeEntry.deleteMany({ created_by_id: userId });
    await base44.asServiceRole.entities.JournalEntry.deleteMany({ created_by_id: userId });
    await base44.asServiceRole.entities.UserQuestionSettings.deleteMany({ created_by_id: userId });

    // Delete billing and analytics records (admin-only RLS)
    await base44.asServiceRole.entities.Subscription.deleteMany({ user_email: email });
    await base44.asServiceRole.entities.Payment.deleteMany({ user_email: email });
    await base44.asServiceRole.entities.AnalyticsEvent.deleteMany({ user_email: email });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});