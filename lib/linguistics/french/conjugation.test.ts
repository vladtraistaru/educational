import { describe, it, expect } from 'vitest';
import { conjugate, getAuxiliary, getParticipe, VERBS, type Pronoun } from './conjugation';

const ALL_PRONOUNS: Pronoun[] = ['je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles'];

describe('présent', () => {
  it('conjugates regular -er verbs (chanter)', () => {
    const v = VERBS.chanter;
    expect(conjugate(v, 'present', 'je')).toBe('je chante');
    expect(conjugate(v, 'present', 'tu')).toBe('tu chantes');
    expect(conjugate(v, 'present', 'il')).toBe('il chante');
    expect(conjugate(v, 'present', 'nous')).toBe('nous chantons');
    expect(conjugate(v, 'present', 'vous')).toBe('vous chantez');
    expect(conjugate(v, 'present', 'elles')).toBe('elles chantent');
  });

  it("elides 'je' before a vowel (aimer)", () => {
    expect(conjugate(VERBS.aimer, 'present', 'je')).toBe("j'aime");
    expect(conjugate(VERBS.aimer, 'present', 'tu')).toBe('tu aimes');
  });

  it('conjugates regular -ir verbs (finir)', () => {
    const v = VERBS.finir;
    expect(conjugate(v, 'present', 'je')).toBe('je finis');
    expect(conjugate(v, 'present', 'il')).toBe('il finit');
    expect(conjugate(v, 'present', 'nous')).toBe('nous finissons');
    expect(conjugate(v, 'present', 'ils')).toBe('ils finissent');
  });

  it('conjugates être (irregular)', () => {
    expect(conjugate(VERBS.être, 'present', 'je')).toBe('je suis');
    expect(conjugate(VERBS.être, 'present', 'nous')).toBe('nous sommes');
    expect(conjugate(VERBS.être, 'present', 'vous')).toBe('vous êtes');
    expect(conjugate(VERBS.être, 'present', 'ils')).toBe('ils sont');
  });

  it('conjugates avoir (irregular, elision)', () => {
    expect(conjugate(VERBS.avoir, 'present', 'je')).toBe("j'ai");
    expect(conjugate(VERBS.avoir, 'present', 'nous')).toBe('nous avons');
    expect(conjugate(VERBS.avoir, 'present', 'ils')).toBe('ils ont');
  });

  it('conjugates aller, faire, dire (irregular)', () => {
    expect(conjugate(VERBS.aller, 'present', 'je')).toBe('je vais');
    expect(conjugate(VERBS.aller, 'present', 'nous')).toBe('nous allons');
    expect(conjugate(VERBS.faire, 'present', 'vous')).toBe('vous faites');
    expect(conjugate(VERBS.dire, 'present', 'vous')).toBe('vous dites');
  });

  it('produces a non-empty string for every pronoun on every known verb', () => {
    for (const verb of Object.values(VERBS)) {
      for (const p of ALL_PRONOUNS) {
        expect(conjugate(verb, 'present', p).length).toBeGreaterThan(0);
      }
    }
  });
});

describe('imparfait', () => {
  it('uses regular endings on -er verbs (chanter)', () => {
    const v = VERBS.chanter;
    expect(conjugate(v, 'imparfait', 'je')).toBe('je chantais');
    expect(conjugate(v, 'imparfait', 'tu')).toBe('tu chantais');
    expect(conjugate(v, 'imparfait', 'il')).toBe('il chantait');
    expect(conjugate(v, 'imparfait', 'nous')).toBe('nous chantions');
    expect(conjugate(v, 'imparfait', 'vous')).toBe('vous chantiez');
    expect(conjugate(v, 'imparfait', 'ils')).toBe('ils chantaient');
  });

  it('derives the stem from nous-form on -ir verbs (finir → finiss-)', () => {
    expect(conjugate(VERBS.finir, 'imparfait', 'je')).toBe('je finissais');
    expect(conjugate(VERBS.finir, 'imparfait', 'nous')).toBe('nous finissions');
  });

  it('uses the special stem ét- for être', () => {
    expect(conjugate(VERBS.être, 'imparfait', 'je')).toBe("j'étais");
    expect(conjugate(VERBS.être, 'imparfait', 'nous')).toBe('nous étions');
    expect(conjugate(VERBS.être, 'imparfait', 'ils')).toBe('ils étaient');
  });

  it('derives faire imparfait from nous faisons → fais-', () => {
    expect(conjugate(VERBS.faire, 'imparfait', 'je')).toBe('je faisais');
    expect(conjugate(VERBS.faire, 'imparfait', 'nous')).toBe('nous faisions');
  });

  it('derives avoir imparfait from nous avons → av-', () => {
    expect(conjugate(VERBS.avoir, 'imparfait', 'je')).toBe("j'avais");
    expect(conjugate(VERBS.avoir, 'imparfait', 'nous')).toBe('nous avions');
  });
});

describe('passé composé', () => {
  it('uses avoir + participe for regular -er verbs (chanter)', () => {
    const v = VERBS.chanter;
    expect(conjugate(v, 'passe-compose', 'je')).toBe("j'ai chanté");
    expect(conjugate(v, 'passe-compose', 'tu')).toBe('tu as chanté');
    expect(conjugate(v, 'passe-compose', 'nous')).toBe('nous avons chanté');
    expect(conjugate(v, 'passe-compose', 'ils')).toBe('ils ont chanté');
  });

  it('uses avoir + participe for regular -ir verbs (finir)', () => {
    expect(conjugate(VERBS.finir, 'passe-compose', 'je')).toBe("j'ai fini");
    expect(conjugate(VERBS.finir, 'passe-compose', 'nous')).toBe('nous avons fini');
  });

  it('uses être + participe for aller', () => {
    expect(conjugate(VERBS.aller, 'passe-compose', 'je')).toBe('je suis allé');
    expect(conjugate(VERBS.aller, 'passe-compose', 'nous')).toBe('nous sommes allé');
    expect(conjugate(VERBS.aller, 'passe-compose', 'ils')).toBe('ils sont allé');
  });

  it('uses irregular participes for être, avoir, faire, dire', () => {
    expect(conjugate(VERBS.être, 'passe-compose', 'je')).toBe("j'ai été");
    expect(conjugate(VERBS.avoir, 'passe-compose', 'je')).toBe("j'ai eu");
    expect(conjugate(VERBS.faire, 'passe-compose', 'il')).toBe('il a fait');
    expect(conjugate(VERBS.dire, 'passe-compose', 'nous')).toBe('nous avons dit');
  });
});

describe('getAuxiliary', () => {
  it('defaults to avoir when not specified', () => {
    expect(getAuxiliary(VERBS.chanter)).toBe('avoir');
    expect(getAuxiliary(VERBS.finir)).toBe('avoir');
    expect(getAuxiliary(VERBS.être)).toBe('avoir');
  });

  it('returns the explicit auxiliary for aller', () => {
    expect(getAuxiliary(VERBS.aller)).toBe('etre');
  });
});

describe('getParticipe', () => {
  it('derives -é for group 1', () => {
    expect(getParticipe(VERBS.chanter)).toBe('chanté');
  });

  it('derives -i for group 2', () => {
    expect(getParticipe(VERBS.finir)).toBe('fini');
  });

  it('returns stored participe for irregular verbs', () => {
    expect(getParticipe(VERBS.être)).toBe('été');
    expect(getParticipe(VERBS.avoir)).toBe('eu');
    expect(getParticipe(VERBS.aller)).toBe('allé');
    expect(getParticipe(VERBS.faire)).toBe('fait');
    expect(getParticipe(VERBS.dire)).toBe('dit');
  });
});
