import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TypingGame from '../components/TypingGame.vue';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('TypingGame.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows loading state initially', () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    const wrapper = mount(TypingGame);
    expect(wrapper.find('.spinner').exists()).toBe(true);
  });

  it('shows error state and retries', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    const wrapper = mount(TypingGame);
    await flushPromises();
    expect(wrapper.text()).toContain('Error');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ answer: 'a' }),
    });
    await wrapper.find('.retry-btn').trigger('click');
    await flushPromises();
    expect(wrapper.find('.sentence-display').exists()).toBe(true);
  });

  it('handles timer logic', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ answer: 'apple,banana' }),
    });

    const wrapper = mount(TypingGame);
    await flushPromises();

    vi.useFakeTimers();
    const input = wrapper.find('input');

    const s1 = wrapper.vm.sentences[0];
    const s2 = wrapper.vm.sentences[1];

    await input.setValue(s1[0]);

    vi.advanceTimersByTime(1000);
    expect(wrapper.vm.elapsedTime).toBeGreaterThan(0.5);

    wrapper.vm.startTimer(); // Branch coverage

    // Complete first sentence
    await input.setValue(s1);
    vi.advanceTimersByTime(150);
    await flushPromises();

    expect(wrapper.vm.currentIndex).toBe(1);

    // Complete second sentence
    await input.setValue(s2);

    const finalTime = wrapper.vm.elapsedTime;
    vi.advanceTimersByTime(1000);
    expect(wrapper.vm.elapsedTime).toBe(finalTime);

    // Test resetGame (Try Again button)
    vi.advanceTimersByTime(150);
    await flushPromises();

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ answer: 'cherry' }),
    });
    const restartBtn = wrapper.find('.restart-btn');
    await restartBtn.trigger('click');
    await flushPromises();
    expect(wrapper.vm.elapsedTime).toBe(0);
    expect(wrapper.vm.currentIndex).toBe(0);
  });

  it('handles invalid response', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    const wrapper = mount(TypingGame);
    await flushPromises();
    expect(wrapper.text()).toContain('Error: Invalid API response');
  });

  it('handles empty sentences', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ answer: '' }),
    });
    const wrapper = mount(TypingGame);
    await flushPromises();
    expect(wrapper.text()).toContain('No sentences found.');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ answer: 'a' }),
    });
    await wrapper.find('.retry-btn').trigger('click');
    await flushPromises();
    expect(wrapper.find('.sentence-display').exists()).toBe(true);
  });

  it('focuses input on click', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ answer: 'a' }),
    });
    const wrapper = mount(TypingGame, { attachTo: document.body });
    await flushPromises();

    vi.useFakeTimers();
    vi.advanceTimersByTime(200);

    const input = wrapper.find('input').element;
    const spy = vi.spyOn(input, 'focus');

    await wrapper.trigger('click');
    expect(spy).toHaveBeenCalled();

    window.dispatchEvent(new Event('click'));
    expect(spy.mock.calls.length).toBeGreaterThan(1);
    wrapper.unmount();
  });

  it('unmounts and removes listener', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ answer: 'a' }),
      });
      const wrapper = mount(TypingGame);
      await flushPromises();
      const spy = vi.spyOn(wrapper.find('input').element, 'focus');

      vi.useFakeTimers();
      const input = wrapper.find('input');
      await input.setValue('a');

      wrapper.unmount();
      window.dispatchEvent(new Event('click'));
      expect(spy).not.toHaveBeenCalled();

      const time = wrapper.vm.elapsedTime;
      vi.advanceTimersByTime(1000);
      expect(wrapper.vm.elapsedTime).toBe(time);
  });
});
