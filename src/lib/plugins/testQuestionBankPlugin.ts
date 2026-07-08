import { QuestionBankPlugin } from './QuestionBankPlugin';

export class TestQuestionBankPlugin {
  static runTests() {
    const plugin = new QuestionBankPlugin();
    const testCases = [
      { name: '100 MCQs', count: 100 },
      { name: '500 MCQs', count: 500 },
      { name: '1000 MCQs', count: 1000 }
    ];

    testCases.forEach(tc => {
      console.log(`Running test: ${tc.name}`);
      const questions = Array.from({ length: tc.count }, (_, i) => ({
        number: i + 1,
        text: `This is question number ${i + 1} with some extra long text to test wrapping.`,
        options: [
          { letter: 'A', text: 'Option A' },
          { letter: 'B', text: 'Option B' },
          { letter: 'C', text: 'Option C' },
          { letter: 'D', text: 'Option D' }
        ],
        image: i % 10 === 0 ? 'data:image/jpeg;base64,...' : undefined,
        table: i % 20 === 0 ? { body: [['Col1', 'Col2'], ['Val1', 'Val2']] } : undefined
      }));

      const result = plugin.render(questions);
      
      // Validation Logic
      if (result.length > 0) {
        console.log(`✓ Test ${tc.name} passed: Definition generated.`);
      } else {
        console.error(`✗ Test ${tc.name} failed: No definition generated.`);
      }
    });
  }
}
