import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const AA_QUESTIONS = [
  { id: 'resentful', question: 'Were You Resentful or Angry Today?', description: 'Notice any people, situations, or thoughts you replayed in your mind that disturbed your peace or kept you emotionally stuck.', type: 'yesno-text' },
  { id: 'dishonest', question: 'Were You Dishonest in Any Way Today?', description: 'Look at what you said, what you avoided saying, and how you may have presented yourself in a way that was not fully truthful.', type: 'yesno-text' },
  { id: 'selfish', question: 'Were You Selfish or Self-Centered Today?', description: 'Reflect on where you put your comfort, control, image, or personal agenda ahead of honesty, fairness, or connection.', type: 'yesno-text' },
  { id: 'fearful', question: 'Were You Fearful or Anxious Today?', description: 'Reflect on where fear or anxiety showed up today, particularly around rejection, abandonment, failure, loss of control, security, or not being enough, and how those fears influenced your thoughts, emotions, or actions.', type: 'yesno-text' },
  { id: 'harmful', question: 'Did You Harm Anyone Today? Do You Owe an Apology?', description: 'Consider whether your words, actions, or omissions caused harm, discomfort, or confusion for someone else.', type: 'yesno-text' },
  { id: 'secret', question: 'Did You Keep a Secret or Withhold the Truth from Someone?', description: 'Since keeping secrets builds shame and isolation, reflect on any secrets, shame, rationalizations, or justifications that you had throughout the day.', type: 'yesno-text' },
  { id: 'unkind', question: 'Were You Kind And Loving Toward All Today?', description: 'Observe moments where you were impatient, irritable, dismissive, cold, selfish or emotionally unavailable.', type: 'yesno-text-no' },
  { id: 'do_well', question: 'What Did You Do Well Today?', description: 'Reflect on what you handled properly today, especially in situations where you normally would have acted from fear, ego, or old patterns.', type: 'yesno-text' },
  { id: 'better', question: 'Is There Anything That You Could Have Done Better Today?', description: 'Reflect on whether you could have handled something better today to see if there was room for growth or a better choice.', type: 'yesno-text' },
  { id: 'gratitude', question: 'Gratitudes', type: 'gratitude' },
  { id: 'avoidance', question: 'Did You Avoid Anything You Needed to Face Today?', description: 'Look at where you procrastinated, avoided conflict, avoided honesty, avoided vulnerability, or stayed in comfort instead of growth.', type: 'yesno-text', optional: true },
  { id: 'authentic', question: 'Were You Authentic Today?', description: 'Reflect on whether you showed up as your real self, or whether you performed, people-pleased, manipulated, hid your feelings, or tried to control how others saw you.', type: 'yesno-text', optional: true },
  { id: 'boundaries', question: 'Did You Respect Your Boundaries and Other People\'s Boundaries Today?', description: 'Reflect on whether you said yes when you meant no, overgave, overcontrolled, crossed boundaries, or allowed resentment to build by not being honest.', type: 'yesno-text', optional: true },
  { id: 'present', question: 'Were You Present Today?', description: 'Reflect on whether you lived in the moment or escaped into distractions, fantasy, overthinking, social media, validation seeking, or future-tripping.', type: 'yesno-text', optional: true },
  { id: 'surrender', question: 'What Did You Need to Let Go of Today?', description: 'Step 10 requires surrender. Reflect on what you tried to control, obsess over, or cling to, and what you may need to release to stay spiritually free.', type: 'yesno-text', optional: true },
  { id: 'prayer', question: 'Did You Take Time for Prayer or Meditation Today?', description: 'Step 10 encourages continued spiritual practice. Reflect on whether you connected to a Higher Power, practiced mindfulness, or grounded yourself spiritually.', type: 'yesno-text', optional: true },
  { id: 'triggers', question: 'What Triggered You Today?', description: 'Reflect on situations or people that activated you emotionally. Look for patterns where you reacted from old wounds, insecurities, or ego.', type: 'yesno-text', optional: true },
  { id: 'lesson', question: 'What Was the Biggest Lesson You Learned Today?', description: 'Step 10 is about growth through awareness. Reflect on what today taught you about yourself, your recovery, your relationships, or your character defects.', type: 'yesno-text', optional: true },
  { id: 'tomorrow', question: 'What Intention Do You Want to Set for Tomorrow?', description: 'Choose one simple intention to carry forward into tomorrow. This creates momentum and keeps you focused on progress instead of perfection.', type: 'yesno-text', optional: true },
  { id: 'service', question: 'Were You of Service Today?', description: 'Step 10 is strengthened through service. Reflect on whether you helped someone, supported someone emotionally, showed kindness, or contributed to someone else\'s well-being without expecting anything in return.', type: 'yesno-text', optional: true }
];

const GENERAL_QUESTIONS = [
  { id: 'emotions', question: 'What Emotions Did You Feel Most Strongly Today?', type: 'text' },
  { id: 'challenged', question: 'What Challenged You Today?', type: 'text' },
  { id: 'well', question: 'What Did You Do Well Today?', type: 'text' },
  { id: 'alignment', question: 'Did You Act Out of Alignment With Your Values? If So, Explain.', type: 'yesno-text' },
  { id: 'avoided', question: 'Did You Avoid Anything Important Today?', type: 'yesno-text' },
  { id: 'joy', question: 'Who or What Brought You Joy Today?', type: 'text' },
  { id: 'gratitude', question: 'What Are You Grateful for Today?', type: 'gratitude' }
];

export default function QuestionSettings({ user, onSave }) {
  const [settings, setSettings] = useState(null);
  const [orderedQuestions, setOrderedQuestions] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ question: '', description: '', type: 'yesno-text' });

  const allQuestions = user.recovery_status === 'aa' ? AA_QUESTIONS : GENERAL_QUESTIONS;

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    const existingSettings = await base44.entities.UserQuestionSettings.filter({
      inventory_type: user.recovery_status,
      created_by: user.email
    });

    if (existingSettings.length > 0) {
      setSettings(existingSettings[0]);
      const ordered = existingSettings[0].question_order
        .map(id => allQuestions.find(q => q.id === id) || existingSettings[0].custom_questions?.find(q => q.id === id))
        .filter(q => q);
      setOrderedQuestions(ordered);
    } else {
      // Initialize with default (non-optional) questions
      const defaultQuestions = allQuestions.filter(q => !q.optional);
      const defaultOrder = defaultQuestions.map(q => q.id);
      setOrderedQuestions(defaultQuestions);
      setSettings({
        inventory_type: user.recovery_status,
        customization_enabled: false,
        enabled_questions: defaultOrder,
        question_order: defaultOrder,
        custom_questions: []
      });
    }
  };

  const handleToggle = (questionId) => {
    const newEnabled = settings.enabled_questions.includes(questionId)
      ? settings.enabled_questions.filter(id => id !== questionId)
      : [...settings.enabled_questions, questionId];

    setSettings({
      ...settings,
      enabled_questions: newEnabled
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(orderedQuestions);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    setOrderedQuestions(items);
    setSettings({
      ...settings,
      question_order: items.map(q => q.id)
    });
  };

  const handleAddCustomQuestion = () => {
    if (!newQuestion.question.trim()) return;

    const customId = `custom_${Date.now()}`;
    const custom = {
      id: customId,
      ...newQuestion
    };

    const updatedCustom = [...(settings.custom_questions || []), custom];
    const updatedOrder = [...settings.question_order, customId];
    const updatedEnabled = [...settings.enabled_questions, customId];

    setSettings({
      ...settings,
      custom_questions: updatedCustom,
      question_order: updatedOrder,
      enabled_questions: updatedEnabled
    });

    setOrderedQuestions([...orderedQuestions, custom]);
    setNewQuestion({ question: '', description: '', type: 'yesno-text' });
    setShowAddDialog(false);
  };

  const handleDeleteCustomQuestion = (questionId) => {
    const updatedCustom = settings.custom_questions.filter(q => q.id !== questionId);
    const updatedOrder = settings.question_order.filter(id => id !== questionId);
    const updatedEnabled = settings.enabled_questions.filter(id => id !== questionId);

    setSettings({
      ...settings,
      custom_questions: updatedCustom,
      question_order: updatedOrder,
      enabled_questions: updatedEnabled
    });

    setOrderedQuestions(orderedQuestions.filter(q => q.id !== questionId));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (settings.id) {
        await base44.entities.UserQuestionSettings.update(settings.id, settings);
      } else {
        await base44.entities.UserQuestionSettings.create(settings);
      }
      onSave?.();
    } catch (err) {
      console.error('Failed to save settings', err);
    }
    setSaving(false);
  };

  if (!settings) {
    return <div className="text-center py-8">Loading...</div>;
  }

  // Separate main questions and optional questions
  const gratitudeIndex = orderedQuestions.findIndex(q => q.id === 'gratitude');
  const mainQuestions = gratitudeIndex !== -1 
    ? orderedQuestions.slice(0, gratitudeIndex)
    : orderedQuestions.filter(q => !q.optional);
  const gratitudeQuestion = orderedQuestions.find(q => q.id === 'gratitude');
  const optionalQuestions = allQuestions.filter(q => q.optional);
  const enabledOptionalQuestions = mainQuestions.filter(q => 
    optionalQuestions.some(opt => opt.id === q.id)
  );
  const additionalQuestions = optionalQuestions.filter(q => 
    !settings.enabled_questions.includes(q.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#1F2C46]">Inventory Questions</h3>
          <p className="text-sm text-gray-500">Customize which questions appear in your daily inventory</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(!editMode)}
            disabled={!settings.customization_enabled}
          >
            {editMode ? 'Done Editing' : 'Edit Order'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddDialog(true)}
            disabled={!settings.customization_enabled}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Custom
          </Button>
        </div>
      </div>
      
      {/* Enable/Disable Customization */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-[#1F2C46]">Enable Question Customization</h4>
            <p className="text-sm text-gray-600 mt-1">
              {settings.customization_enabled 
                ? 'Custom question settings are active' 
                : 'Using default questions - toggle to customize'}
            </p>
          </div>
          <Switch
            checked={settings.customization_enabled || false}
            onCheckedChange={(checked) => {
              setSettings({
                ...settings,
                customization_enabled: checked
              });
            }}
          />
        </div>
      </div>
      
      {/* Main Questions (enabled and before gratitude) */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Main Questions</h4>

        {editMode ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="main-questions">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {mainQuestions.filter(q => q.id !== 'gratitude').map((question, index) => (
                    <Draggable key={question.id} draggableId={question.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-3"
                        >
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-[#1F2C46]">{question.question}</p>
                            {question.description && (
                              <p className="text-sm text-gray-500 mt-1">{question.description}</p>
                            )}
                          </div>
                          <Switch
                           checked={settings.enabled_questions.includes(question.id)}
                           onCheckedChange={() => handleToggle(question.id)}
                           disabled={!settings.customization_enabled}
                          />
                          {question.id.startsWith('custom_') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCustomQuestion(question.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="space-y-2">
            {mainQuestions.filter(q => q.id !== 'gratitude').map((question, index) => (
              <div key={question.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-4">
                <span className="text-sm font-medium text-gray-400 w-8">{index + 1}</span>
                <div className="flex-1">
                  <p className="font-medium text-[#1F2C46]">{question.question}</p>
                  {question.description && (
                    <p className="text-sm text-gray-500 mt-1">{question.description}</p>
                  )}
                </div>
                <Switch
                  checked={settings.enabled_questions.includes(question.id)}
                  onCheckedChange={() => handleToggle(question.id)}
                  disabled={!question.optional || !settings.customization_enabled}
                />
                {question.id.startsWith('custom_') && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCustomQuestion(question.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Gratitude Question (always last) */}
      {gratitudeQuestion && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">Gratitude</h4>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="flex-1">
              <p className="font-medium text-[#1F2C46]">{gratitudeQuestion.question}</p>
              {gratitudeQuestion.description && (
                <p className="text-sm text-gray-500 mt-1">{gratitudeQuestion.description}</p>
              )}
            </div>
            <Switch
              checked={settings.enabled_questions.includes(gratitudeQuestion.id)}
              onCheckedChange={() => handleToggle(gratitudeQuestion.id)}
              disabled={!settings.customization_enabled}
            />
          </div>
        </div>
      )}
      
      {/* Additional Questions (Optional, off by default) */}
      {additionalQuestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">Additional Questions</h4>
          <p className="text-xs text-gray-500 mb-2">Enable these questions to add them to your main inventory</p>
          <div className="space-y-2">
            {additionalQuestions.map((question) => (
              <div key={question.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium text-[#1F2C46]">{question.question}</p>
                  {question.description && (
                    <p className="text-sm text-gray-500 mt-1">{question.description}</p>
                  )}
                </div>
                <Switch
                  checked={settings.enabled_questions.includes(question.id)}
                  onCheckedChange={() => {
                    if (!settings.enabled_questions.includes(question.id)) {
                      // Add to main questions (before gratitude)
                      const gratitudeIdx = settings.question_order.indexOf('gratitude');
                      const newOrder = [...settings.question_order];
                      if (gratitudeIdx !== -1) {
                        newOrder.splice(gratitudeIdx, 0, question.id);
                      } else {
                        newOrder.push(question.id);
                      }
                      
                      setSettings({
                        ...settings,
                        enabled_questions: [...settings.enabled_questions, question.id],
                        question_order: newOrder
                      });
                      
                      // Update ordered questions
                      const newOrderedQuestions = newOrder
                        .map(id => allQuestions.find(q => q.id === id) || settings.custom_questions?.find(q => q.id === id))
                        .filter(q => q);
                      setOrderedQuestions(newOrderedQuestions);
                    } else {
                      handleToggle(question.id);
                    }
                  }}
                  disabled={!settings.customization_enabled}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Question</label>
              <Input
                placeholder="Enter your question..."
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Description (optional)</label>
              <Textarea
                placeholder="Add a description to guide your reflection..."
                value={newQuestion.description}
                onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddCustomQuestion}>Add Question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}