import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TypingGame from '../components/TypingGame.vue';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('TypingGame.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
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

  it('renders sentences and handles typing', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ answer: 'a,b' }),
    });

    const wrapper = mount(TypingGame);
    await flushPromises();

    expect(wrapper.find('.sentence-display').exists()).toBe(true);
    const display = wrapper.find('.sentence-display');
    const text = display.text();

    const input = wrapper.find('input');
    await input.setValue(text);

    vi.useFakeTimers();
    await input.trigger('input');

    expect(wrapper.find('.char-correct').exists()).toBe(true);

    vi.advanceTimersByTime(150);
    await flushPromises();
    await flushPromises();

    expect(wrapper.find('.counter').text()).toContain('2 / 2');
    vi.useRealTimers();
  });

  it('completes game and restarts', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ answer: 'a' }),
    });

    const wrapper = mount(TypingGame);
    await flushPromises();

    const input = wrapper.find('input');
    await input.setValue('a');

    vi.useFakeTimers();
    await input.trigger('input');

    vi.advanceTimersByTime(150);
    await flushPromises();

    expect(wrapper.text()).toContain('Well Done!');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ answer: 'b' }),
    });

    await wrapper.find('.restart-btn').trigger('click');
    await flushPromises();

    expect(wrapper.find('.counter').text()).toContain('1 / 1');
    vi.useRealTimers();
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
    // Access currentSentence to cover fallback branch
    expect(wrapper.vm.currentSentence).toBe('');
    expect(wrapper.text()).toContain('No sentences found.');
  });

  it('focuses input on click', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ answer: 'a' }),
    });
    const wrapper = mount(TypingGame, { attachTo: document.body });

    vi.useFakeTimers();
    await flushPromises();
    vi.advanceTimersByTime(150);

    const input = wrapper.find('input').element;
    const spy = vi.spyOn(input, 'focus');

    const callsBefore = spy.mock.calls.length;

    await wrapper.trigger('click');
    expect(spy.mock.calls.length).toBeGreaterThan(callsBefore);

    const afterClick = spy.mock.calls.length;
    window.dispatchEvent(new Event('click'));
    expect(spy.mock.calls.length).toBeGreaterThan(afterClick);

    wrapper.unmount();
    vi.useRealTimers();
  });

  it('unmounts and removes listener', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ answer: 'a' }),
      });
      const wrapper = mount(TypingGame);
      await flushPromises();
      const input = wrapper.find('input').element;
      const spy = vi.spyOn(input, 'focus');

      wrapper.unmount();
      window.dispatchEvent(new Event('click'));
      expect(spy).not.toHaveBeenCalled();
  });
});
