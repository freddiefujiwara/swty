import { describe, it, expect, vi } from 'vitest';

describe('main.js', () => {
  it('mounts the app', async () => {
    // Create the mount point
    const root = document.createElement('div');
    root.id = 'app';
    document.body.appendChild(root);

    // Mock fetch for TypingGame inside App to avoid real network calls
    global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ answer: 'a' })
    });

    // Import main.js to execute the createApp and mount
    await import('../main.js?t=' + Date.now());

    // Check if something was rendered inside the app div
    expect(root.innerHTML).not.toBe('');
    expect(root.innerHTML).toContain('English Typing');
  });
});
