import { describe, it, expect } from 'vitest';
import {
  kpis,
  projects,
  skills,
  timeline,
  contact,
} from '../data';

describe('kpis', () => {
  it('has exactly 4 items', () => {
    expect(kpis).toHaveLength(4);
  });

  it('each item has required fields: id, label, value, colour', () => {
    for (const kpi of kpis) {
      expect(typeof kpi.id).toBe('string');
      expect(kpi.id.length).toBeGreaterThan(0);
      expect(typeof kpi.label).toBe('string');
      expect(kpi.label.length).toBeGreaterThan(0);
      expect(typeof kpi.value).toBe('string');
      expect(kpi.value.length).toBeGreaterThan(0);
      expect(typeof kpi.colour).toBe('string');
      expect(kpi.colour.length).toBeGreaterThan(0);
    }
  });

  it('each item has a non-empty sparklineData array', () => {
    for (const kpi of kpis) {
      expect(Array.isArray(kpi.sparklineData)).toBe(true);
      expect(kpi.sparklineData.length).toBeGreaterThan(0);
    }
  });

  it('ids are unique', () => {
    const ids = kpis.map((k) => k.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('projects', () => {
  it('has exactly 3 items', () => {
    expect(projects).toHaveLength(3);
  });

  it('each item has a reportId', () => {
    for (const project of projects) {
      expect(typeof project.reportId).toBe('string');
      expect(project.reportId.length).toBeGreaterThan(0);
    }
  });

  it('each item has required fields: id, slug, name, status, colour, description', () => {
    for (const project of projects) {
      expect(typeof project.id).toBe('string');
      expect(project.id.length).toBeGreaterThan(0);
      expect(typeof project.slug).toBe('string');
      expect(project.slug.length).toBeGreaterThan(0);
      expect(typeof project.name).toBe('string');
      expect(project.name.length).toBeGreaterThan(0);
      expect(['live', 'complete']).toContain(project.status);
      expect(typeof project.colour).toBe('string');
      expect(project.colour.length).toBeGreaterThan(0);
      expect(typeof project.description).toBe('string');
      expect(project.description.length).toBeGreaterThan(0);
    }
  });

  it('each item has a non-empty techStack array', () => {
    for (const project of projects) {
      expect(Array.isArray(project.techStack)).toBe(true);
      expect(project.techStack.length).toBeGreaterThan(0);
    }
  });
});

describe('skills', () => {
  it('has exactly 3 groups', () => {
    expect(skills).toHaveLength(3);
  });

  it('each group has a non-empty skills array', () => {
    for (const group of skills) {
      expect(Array.isArray(group.skills)).toBe(true);
      expect(group.skills.length).toBeGreaterThan(0);
    }
  });

  it('each skill has required fields: name, icon, proficiency, colour', () => {
    for (const group of skills) {
      for (const skill of group.skills) {
        expect(typeof skill.name).toBe('string');
        expect(skill.name.length).toBeGreaterThan(0);
        expect(typeof skill.icon).toBe('string');
        expect(skill.icon.length).toBeGreaterThan(0);
        expect(typeof skill.proficiency).toBe('number');
        expect(skill.proficiency).toBeGreaterThanOrEqual(1);
        expect(skill.proficiency).toBeLessThanOrEqual(5);
        expect(typeof skill.colour).toBe('string');
        expect(skill.colour.length).toBeGreaterThan(0);
      }
    }
  });

  it('each group has a non-empty groupLabel', () => {
    for (const group of skills) {
      expect(typeof group.groupLabel).toBe('string');
      expect(group.groupLabel.length).toBeGreaterThan(0);
    }
  });
});

describe('timeline', () => {
  it('has exactly 5 nodes', () => {
    expect(timeline).toHaveLength(5);
  });

  it('last node has isActive: true', () => {
    const last = timeline[timeline.length - 1];
    expect(last).toBeDefined();
    expect(last!.isActive).toBe(true);
  });

  it('all nodes except the last have isActive: false', () => {
    const allButLast = timeline.slice(0, -1);
    for (const node of allButLast) {
      expect(node.isActive).toBe(false);
    }
  });

  it('each node has required fields: role, date, colour, tags', () => {
    for (const node of timeline) {
      expect(typeof node.role).toBe('string');
      expect(node.role.length).toBeGreaterThan(0);
      expect(typeof node.date).toBe('string');
      expect(node.date.length).toBeGreaterThan(0);
      expect(typeof node.colour).toBe('string');
      expect(node.colour.length).toBeGreaterThan(0);
      expect(Array.isArray(node.tags)).toBe(true);
      expect(node.tags.length).toBeGreaterThan(0);
    }
  });
});

describe('contact', () => {
  it('email is a valid email format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(contact.email)).toBe(true);
  });

  it('linkedin is a valid URL', () => {
    expect(contact.linkedin).toMatch(/^https?:\/\//);
  });

  it('resumePath starts with /', () => {
    expect(contact.resumePath).toMatch(/^\//);
  });

  it('calendarLink is defined and non-empty', () => {
    expect(typeof contact.calendarLink).toBe('string');
    expect(contact.calendarLink.length).toBeGreaterThan(0);
  });
});
