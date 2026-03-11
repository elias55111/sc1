/**
 * Bot Personalities System
 * Verschiedene Bot-Verhaltensweisen und Charaktere
 */

const BotPersonalities = (function() {
  'use strict';
  
  // Bot-Persönlichkeiten Definitionen
  const PERSONALITIES = {
    'sniper': {
      name: 'Der Präzisionsschütze',
      description: 'Extrem präzise, aber langsam',
      icon: '🎯',
      traits: {
        accuracy: 0.95,           // Treffgenauigkeit (0-1)
        speedFactor: 0.6,         // Schussgeschwindigkeit (0-1)
        consistency: 0.9,         // Konstanz (0-1)
        pressureHandling: 0.85,   // Druckverarbeitung (0-1)
        riskTaking: 0.2,          // Risikobereitschaft (0-1)
        learningRate: 0.1         // Lernfähigkeit (0-1)
      },
      behavior: {
        shotDelay: { min: 2.5, max: 4.0 },      // Verzögerung zwischen Schüssen
        accuracyCurve: 'exponential',          // Genauigkeitskurve
        stressResponse: 'improves',            // Reaktion unter Druck
        improvementPattern: 'steady',           // Verbesserungsmuster
        favoritePositions: ['lying', 'standing'] // Bevorzugte Positionen
      },
      colors: {
        primary: '#2E8B57',
        secondary: '#228B22',
        accent: '#32CD32'
      }
    },
    
    'sprinter': {
      name: 'Der Schnellschütze',
      description: 'Schnell, aber mit Variationen',
      icon: '⚡',
      traits: {
        accuracy: 0.7,
        speedFactor: 1.4,
        consistency: 0.5,
        pressureHandling: 0.4,
        riskTaking: 0.8,
        learningRate: 0.3
      },
      behavior: {
        shotDelay: { min: 0.8, max: 1.5 },
        accuracyCurve: 'linear',
        stressResponse: 'declines',
        improvementPattern: 'erratic',
        favoritePositions: ['kneeling', 'lying']
      },
      colors: {
        primary: '#FF6347',
        secondary: '#FF4500',
        accent: '#FFD700'
      }
    },
    
    'veteran': {
      name: 'Der erfahrene Veteran',
      description: 'Ausgewogen und konstant',
      icon: '🏆',
      traits: {
        accuracy: 0.85,
        speedFactor: 1.0,
        consistency: 0.95,
        pressureHandling: 0.8,
        riskTaking: 0.5,
        learningRate: 0.2
      },
      behavior: {
        shotDelay: { min: 1.5, max: 2.5 },
        accuracyCurve: 'stable',
        stressResponse: 'stable',
        improvementPattern: 'consistent',
        favoritePositions: ['lying', 'kneeling', 'standing']
      },
      colors: {
        primary: '#4169E1',
        secondary: '#0000CD',
        accent: '#87CEEB'
      }
    },
    
    'rookie': {
      name: 'Der aufstrebende Rookie',
      description: 'Lernfähig mit Potential',
      icon: '🌟',
      traits: {
        accuracy: 0.6,
        speedFactor: 1.2,
        consistency: 0.4,
        pressureHandling: 0.3,
        riskTaking: 0.6,
        learningRate: 0.5
      },
      behavior: {
        shotDelay: { min: 1.0, max: 2.0 },
        accuracyCurve: 'improving',
        stressResponse: 'learning',
        improvementPattern: 'progressive',
        favoritePositions: ['lying', 'kneeling']
      },
      colors: {
        primary: '#9370DB',
        secondary: '#8A2BE2',
        accent: '#DDA0DD'
      }
    }
  };
  
  // Aktuelle Persönlichkeit
  let currentPersonality = null;
  let originalDifficulty = null;
  
  /**
   * Initialisiert das Persönlichkeits-System
   */
  function init() {
    console.log('🎭 Bot Personalities System initialisiert');
    createPersonalitySelector();
  }
  
  /**
   * Erstellt die Persönlichkeits-Auswahl-Oberfläche
   */
  function createPersonalitySelector() {
    // Warte bis DOM bereit ist
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createPersonalitySelector);
      return;
    }
    
    const selectorHTML = `
      <div id="personalitySelector" class="personality-selector" style="display: none;">
        <div class="personality-header">
          <h3>🎭 Wähle deinen Gegner</h3>
          <p>Jeder Bot hat seinen eigenen Stil und Charakter</p>
        </div>
        <div class="personality-cards">
          ${Object.entries(PERSONALITIES).map(([key, personality]) => `
            <div class="personality-card" data-personality="${key}">
              <div class="personality-icon">${personality.icon}</div>
              <h4>${personality.name}</h4>
              <p class="personality-description">${personality.description}</p>
              <div class="personality-stats">
                <div class="stat-row">
                  <span class="stat-label">Präzision</span>
                  <div class="stat-bar">
                    <div class="stat-fill" style="width: ${personality.traits.accuracy * 100}%; background: ${personality.colors.primary}"></div>
                  </div>
                  <span class="stat-value">${Math.round(personality.traits.accuracy * 100)}%</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Geschwindigkeit</span>
                  <div class="stat-bar">
                    <div class="stat-fill" style="width: ${personality.traits.speedFactor * 70}%; background: ${personality.colors.secondary}"></div>
                  </div>
                  <span class="stat-value">${Math.round(personality.traits.speedFactor * 100)}%</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Konstanz</span>
                  <div class="stat-bar">
                    <div class="stat-fill" style="width: ${personality.traits.consistency * 100}%; background: ${personality.colors.accent}"></div>
                  </div>
                  <span class="stat-value">${Math.round(personality.traits.consistency * 100)}%</span>
                </div>
              </div>
              <div class="personality-behavior">
                <small>🎯 ${getBehaviorDescription(personality)}</small>
              </div>
              <button class="select-personality-btn" onclick="BotPersonalities.selectPersonality('${key}')">
                Gegen ${personality.name} spielen
              </button>
            </div>
          `).join('')}
        </div>
        <div class="personality-actions">
          <button class="btn-random-personality" onclick="BotPersonalities.selectRandomPersonality()">
            🎲 Zufällige Auswahl
          </button>
          <button class="btn-classic-mode" onclick="BotPersonalities.useClassicMode()">
            🤖 Klassischer Modus
          </button>
        </div>
      </div>
    `;
    
    // Füge Selector zum DOM hinzu
    const setupScreen = document.getElementById('screenSetup');
    if (setupScreen) {
      const selectorDiv = document.createElement('div');
      selectorDiv.innerHTML = selectorHTML;
      setupScreen.appendChild(selectorDiv.firstElementChild);
    }
    
    // CSS hinzufügen
    addPersonalityStyles();
  }
  
  /**
   * Fügt Styles für die Persönlichkeits-Auswahl hinzu
   */
  function addPersonalityStyles() {
    const styles = `
      <style>
        .personality-selector {
          background: rgba(20, 25, 15, 0.95);
          border: 1px solid rgba(120, 180, 50, 0.3);
          border-radius: 16px;
          padding: 24px;
          margin: 20px 0;
          backdrop-filter: blur(10px);
        }
        
        .personality-header {
          text-align: center;
          margin-bottom: 24px;
        }
        
        .personality-header h3 {
          color: #e8e8e0;
          margin: 0 0 8px 0;
          font-size: 1.4rem;
        }
        
        .personality-header p {
          color: rgba(200, 200, 190, 0.8);
          margin: 0;
          font-size: 0.9rem;
        }
        
        .personality-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .personality-card {
          background: rgba(30, 35, 25, 0.8);
          border: 1px solid rgba(120, 180, 50, 0.2);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .personality-card:hover {
          transform: translateY(-2px);
          border-color: rgba(120, 180, 50, 0.5);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
        
        .personality-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
          display: block;
        }
        
        .personality-card h4 {
          color: #e8e8e0;
          margin: 0 0 8px 0;
          font-size: 1.1rem;
        }
        
        .personality-description {
          color: rgba(200, 200, 190, 0.9);
          font-size: 0.85rem;
          margin: 0 0 16px 0;
          line-height: 1.4;
        }
        
        .personality-stats {
          margin: 16px 0;
        }
        
        .stat-row {
          display: flex;
          align-items: center;
          margin: 8px 0;
          font-size: 0.8rem;
        }
        
        .stat-label {
          color: rgba(200, 200, 190, 0.8);
          width: 80px;
          text-align: left;
        }
        
        .stat-bar {
          flex: 1;
          height: 6px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
          margin: 0 8px;
          overflow: hidden;
        }
        
        .stat-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }
        
        .stat-value {
          color: #e8e8e0;
          width: 40px;
          text-align: right;
          font-weight: 500;
        }
        
        .personality-behavior {
          margin: 12px 0;
          min-height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .personality-behavior small {
          color: rgba(180, 200, 160, 0.9);
          font-style: italic;
        }
        
        .select-personality-btn {
          background: linear-gradient(135deg, #7ab030, #6aa028);
          color: #0a0f06;
          border: none;
          border-radius: 8px;
          padding: 12px 20px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          margin-top: 8px;
        }
        
        .select-personality-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(122, 176, 48, 0.3);
        }
        
        .personality-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        
        .btn-random-personality,
        .btn-classic-mode {
          background: rgba(120, 180, 50, 0.2);
          color: #e8e8e0;
          border: 1px solid rgba(120, 180, 50, 0.4);
          border-radius: 8px;
          padding: 10px 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.85rem;
        }
        
        .btn-random-personality:hover,
        .btn-classic-mode:hover {
          background: rgba(120, 180, 50, 0.3);
          border-color: rgba(120, 180, 50, 0.6);
        }
        
        @media (max-width: 768px) {
          .personality-cards {
            grid-template-columns: 1fr;
          }
          
          .personality-actions {
            flex-direction: column;
          }
        }
      </style>
    `;
    
    // Füge Styles zum Head hinzu
    const styleElement = document.createElement('div');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement.firstElementChild);
  }
  
  /**
   * Wählt eine Persönlichkeit aus
   */
  function selectPersonality(personalityKey) {
    if (!PERSONALITIES[personalityKey]) {
      console.warn(`🎭 Unbekannte Persönlichkeit: ${personalityKey}`);
      return;
    }
    
    currentPersonality = PERSONALITIES[personalityKey];
    
    // Speichere Auswahl
    try {
      localStorage.setItem('sd_selected_personality', personalityKey);
    } catch (e) {
      console.warn('Konnte Persönlichkeits-Auswahl nicht speichern:', e);
    }
    
    console.log(`🎭 Persönlichkeit ausgewählt: ${currentPersonality.name}`);
    
    // Event auslösen
    window.dispatchEvent(new CustomEvent('personalitySelected', {
      detail: { personality: currentPersonality, key: personalityKey }
    }));
    
    // UI aktualisieren
    updateUIWithPersonality();
    
    // Selector ausblenden
    hidePersonalitySelector();
  }
  
  /**
   * Wählt eine zufällige Persönlichkeit
   */
  function selectRandomPersonality() {
    const keys = Object.keys(PERSONALITIES);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    selectPersonality(randomKey);
  }
  
  /**
   * Verwendet den klassischen Modus (keine Persönlichkeit)
   */
  function useClassicMode() {
    currentPersonality = null;
    
    try {
      localStorage.removeItem('sd_selected_personality');
    } catch (e) {
      console.warn('Konnte Persönlichkeits-Auswahl nicht entfernen:', e);
    }
    
    console.log('🤖 Klassischer Modus aktiviert');
    
    window.dispatchEvent(new CustomEvent('classicModeSelected'));
    hidePersonalitySelector();
  }
  
  /**
   * Aktualisiert die UI mit der ausgewählten Persönlichkeit
   */
  function updateUIWithPersonality() {
    if (!currentPersonality) return;
    
    // Aktualisiere Bot-Anzeige
    const botInfoElements = document.querySelectorAll('.bot-info, .diff-badge, .diff-info');
    botInfoElements.forEach(element => {
      if (element.textContent.includes('Bot') || element.textContent.includes('KREISKLASSE') || 
          element.textContent.includes('BEZIRKSLIGA') || element.textContent.includes('WM-NIVEAU') || 
          element.textContent.includes('WELTREKORD')) {
        // Füge Persönlichkeits-Info hinzu
        const personalityIndicator = document.createElement('div');
        personalityIndicator.className = 'personality-indicator';
        personalityIndicator.innerHTML = `
          <span class="personality-icon-small">${currentPersonality.icon}</span>
          <span class="personality-name-small">${currentPersonality.name}</span>
        `;
        
        if (!element.querySelector('.personality-indicator')) {
          element.appendChild(personalityIndicator);
        }
      }
    });
  }
  
  /**
   * Generiert Bot-Score basierend auf Persönlichkeit
   */
  function generateBotScore(position, shotIndex, gameContext) {
    if (!currentPersonality) {
      // Fallback zu klassischem Bot
      return generateClassicBotScore(position, shotIndex, gameContext);
    }
    
    const personality = currentPersonality;
    const traits = adaptTraitsToContext(personality.traits, gameContext);
    
    // Basis-Score für die Position
    const baseScore = getBaseScoreForPosition(position);
    
    // Wende Persönlichkeits-Merkmale an
    const accuracyFactor = traits.accuracy;
    const consistencyFactor = traits.consistency;
    const speedFactor = traits.speedFactor;
    
    // Berücksichtige Stress und Druck
    const pressureModifier = calculatePressureModifier(traits.pressureHandling, gameContext);
    
    // Generiere finalen Score
    let finalScore = baseScore * accuracyFactor * pressureModifier;
    
    // Füge Variation basierend auf Konsistenz hinzu
    const randomVariation = (Math.random() - 0.5) * (1 - consistencyFactor) * 2;
    finalScore += randomVariation;
    
    // Wende Verhaltens-Regeln an
    finalScore = applyBehaviorRules(finalScore, personality.behavior, shotIndex, gameContext);
    
    return Math.max(0, Math.min(10.9, finalScore));
  }
  
  /**
   * Passt Persönlichkeits-Merkmale an Spiel-Kontext an
   */
  function adaptTraitsToContext(traits, gameContext) {
    const adapted = { ...traits };
    
    // Unter Druck-Verhalten
    if (gameContext.isFinalRound && Math.abs(gameContext.scoreDifference) < 5) {
      if (traits.pressureHandling > 0.7) {
        // Guter Druck-Handler wird besser
        adapted.accuracy *= 1.1;
        adapted.consistency *= 1.05;
      } else if (traits.pressureHandling < 0.5) {
        // Schlechter Druck-Handler wird schlechter
        adapted.accuracy *= 0.85;
        adapted.consistency *= 0.9;
      }
    }
    
    // Position-Bevorzugung
    if (gameContext.currentPosition && 
        traits.favoritePositions && 
        traits.favoritePositions.includes(gameContext.currentPosition)) {
      adapted.accuracy *= 1.05;
      adapted.consistency *= 1.02;
    }
    
    return adapted;
  }
  
  /**
   * Berechnet Stress-Modifikator
   */
  function calculatePressureModifier(pressureHandling, gameContext) {
    let modifier = 1.0;
    
    if (gameContext.isFinalRound) {
      modifier += (pressureHandling - 0.5) * 0.3;
    }
    
    if (gameContext.remainingShots < 5 && Math.abs(gameContext.scoreDifference) < 3) {
      modifier += (pressureHandling - 0.5) * 0.2;
    }
    
    return Math.max(0.5, Math.min(1.5, modifier));
  }
  
  /**
   * Wendet Verhaltens-Regeln an
   */
  function applyBehaviorRules(score, behavior, shotIndex, gameContext) {
    let modifiedScore = score;
    
    // Verbesserungsmuster
    if (behavior.improvementPattern === 'progressive') {
      // Rookie verbessert sich über das Spiel
      const progressFactor = shotIndex / gameContext.totalShots;
      modifiedScore *= (1 + progressFactor * 0.2);
    } else if (behavior.improvementPattern === 'erratic') {
      // Sprinter hat unregelmäßige Leistung
      const randomFactor = Math.sin(shotIndex * 0.5) * 0.1;
      modifiedScore += randomFactor;
    }
    
    // Stress-Response
    if (behavior.stressResponse === 'improves' && gameContext.isFinalRound) {
      modifiedScore *= 1.05;
    } else if (behavior.stressResponse === 'declines' && gameContext.isFinalRound) {
      modifiedScore *= 0.95;
    }
    
    return modifiedScore;
  }
  
  /**
   * Hilfsfunktionen
   */
  function getBehaviorDescription(personality) {
    const behavior = personality.behavior;
    const responses = {
      'improves': 'Wird unter Druck besser',
      'declines': 'Wird unter Druck nervös',
      'stable': 'Bleibt unter Druck ruhig',
      'learning': 'Lernt aus Druck-Situationen'
    };
    
    const patterns = {
      'steady': 'Konstante Leistung',
      'erratic': 'Wechselhafte Leistung',
      'progressive': 'Verbessert sich',
      'improving': 'Wird besser über Zeit'
    };
    
    return `${responses[behavior.stressResponse] || ''} • ${patterns[behavior.improvementPattern] || ''}`;
  }
  
  function getBaseScoreForPosition(position) {
    // Basis-Scores für verschiedene Positionen
    const baseScores = {
      'lying': 8.5,
      'kneeling': 7.8,
      'standing': 7.2
    };
    
    return baseScores[position] || 8.0;
  }
  
  function generateClassicBotScore(position, shotIndex, gameContext) {
    // Fallback zu klassischem Bot-Verhalten
    const baseScore = getBaseScoreForPosition(position);
    const randomVariation = (Math.random() - 0.5) * 2;
    return Math.max(0, Math.min(10.9, baseScore + randomVariation));
  }
  
  /**
   * Zeigt/Versteckt den Persönlichkeits-Selector
   */
  function showPersonalitySelector() {
    const selector = document.getElementById('personalitySelector');
    if (selector) {
      selector.style.display = 'block';
      selector.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  function hidePersonalitySelector() {
    const selector = document.getElementById('personalitySelector');
    if (selector) {
      selector.style.display = 'none';
    }
  }
  
  /**
   * Lädt gespeicherte Persönlichkeit
   */
  function loadSavedPersonality() {
    try {
      const saved = localStorage.getItem('sd_selected_personality');
      if (saved && PERSONALITIES[saved]) {
        currentPersonality = PERSONALITIES[saved];
        console.log(`🎭 Gespeicherte Persönlichkeit geladen: ${currentPersonality.name}`);
        return true;
      }
    } catch (e) {
      console.warn('Konnte gespeicherte Persönlichkeit nicht laden:', e);
    }
    return false;
  }
  
  /**
   * Öffentliche API
   */
  return {
    init,
    PERSONALITIES,
    selectPersonality,
    selectRandomPersonality,
    useClassicMode,
    generateBotScore,
    showPersonalitySelector,
    hidePersonalitySelector,
    loadSavedPersonality,
    getCurrentPersonality: () => currentPersonality,
    isUsingPersonality: () => currentPersonality !== null
  };
})();

// Initialisierung
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    BotPersonalities.init();
  });
}