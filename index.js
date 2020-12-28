const readline = require('readline')
const ru = require('./locales/ru')
const en = require('./locales/en')

function prompt(message) {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question(message, function(result) {
      rl.close()
      resolve(result)
    })
  })
}

function getLocale() {
  return Intl.DateTimeFormat()
    .resolvedOptions()
    .locale.slice(0, 2)
}

function t(text) {
  const locale = getLocale()

  if (locale === 'ru') {
    return ru.i18n[text] || text
  }

  return text
}

function randomElement(array) {
  const i = Math.floor(Math.random() * array.length)
  return array[i]
}

function randomWord() {
  const locale = getLocale()
  let topics = en.topics
  if (locale === 'ru') {
    topics = ru.topics
  }
  const { question, words } = topics[randomElement(Object.keys(topics))]
  const word = randomElement(words)

  return { word, question }
}

function gameOver({ word, isPlayerWin }) {
  const asciiHanger = '____\n|/ |\n|  💀\n| /|\\\n| / \\\n|\n====='
  if (isPlayerWin) {
    console.log(`${t('Congratulations')}! ${t('You won')}! 🎉`)
    console.log('🎁')
  } else {
    console.log(`${t("It's a pity, but you lost")} 😥`)
    console.log(asciiHanger)
  }

  console.log(`${t('Correct answer is')}`, word)
}

async function main() {
  const { word, question } = randomWord()
  const attempts = 7
  let wrongAnsers = 0
  const letters = word.split('').map(_ => '_')

  console.log(`🕹  ${question}:`)
  console.log(letters.join(' '))

  while (wrongAnsers < attempts) {
    const input = await prompt(`${t('What letter')}? `)
    const letter = input.length ? input[0].toLowerCase() : ''

    if (
      word
        .toLowerCase()
        .split('')
        .includes(letter)
    ) {
      word.split('').forEach((l, i) => {
        if (l.toLowerCase() === letter) {
          letters[i] = l
        }
      })
      console.log(`✅ ${t("That's right, this word has letter")} ${letter}`)

      if (letters.join('') === word) {
        gameOver({ word, isPlayerWin: true })
        return
      }
    } else {
      console.log(`❌ ${t('In this word there is no letter')} ${letter}`)
      wrongAnsers++

      const left = attempts - wrongAnsers
      let attemptStr = left === 1 ? t('attempt') : t('attempts')

      if (wrongAnsers < attempts) {
        console.log(
          `🚧 ${t('You have')} ${left} ${attemptStr}! ${t('Be careful')}!`
        )
      }
    }
    console.log(letters.join(' '))
  }

  gameOver({ word, isPlayerWin: false })
}

module.exports = {
  default: main
}
