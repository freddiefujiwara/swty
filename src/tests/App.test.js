import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import App from '../App.vue';
import TypingGame from '../components/TypingGame.vue';

// Mock TypingGame to avoid side effects (API calls, etc.)
vi.mock('../components/TypingGame.vue', () => ({
  default: {
    name: 'TypingGame',
    template: '<div class="mock-typing-game"></div>'
  }
}));

describe('App.vue', () => {
  it('renders header, typing game and footer', () => {
    const wrapper = mount(App);

    expect(wrapper.find('h1').text()).toBe('English Typing');
    expect(wrapper.find('.mock-typing-game').exists()).toBe(true);
    expect(wrapper.find('footer').text()).toBe('Clean & Simple Typing Practice');
  });
});
