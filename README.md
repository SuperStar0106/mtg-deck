# Magic: The Gathering Deck

Magic: The Gathering Deck Builder is a web application designed to enhance the experience of Magic: The Gathering players by providing a tool to search for cards, add them to a deck, and calculate the average mana cost of the deck. This application is built with a focus on user experience, efficiency, and accessibility, making it easier for players to manage their decks and strategize their gameplay.

## Overview

Magic: The Gathering is a popular collectible card game that has been captivating players for over 20 years. The game revolves around the use of a deck of cards, which includes lands (cards that produce mana) and other cards (spells, rituals, creatures, artifacts, or enchantments) that require mana to be played. The objective is to build a deck of at least 20 cards (though players often use a smaller number for ease of play) and to calculate the average mana cost of the deck, excluding lands.

## Features

* Card Search: Users can search for cards by name, color, type, subtype, and text.
* Deck Management: Users can add cards to their deck, ensuring they do not exceed the maximum of 30 cards.
* Average Mana Cost Calculation: The application calculates the average mana cost of the cards in the deck, excluding lands, providing players with insights into their deck's mana efficiency.

## Development Strategy

The development of Magic: The Gathering Deck Builder was guided by the following principles:

* Modular Design: The application is structured into reusable components to ensure code maintainability and ease of updates.
* Responsive UI: The user interface is designed to be responsive, providing a seamless experience across different devices.
* Performance Optimization: The application is optimized for performance, ensuring fast loading times and efficient data fetching.
* Accessibility: The application is designed with accessibility in mind, ensuring it is usable by as many users as possible.

## Technical Implementation

The application leverages the Magic: The Gathering API to fetch card data. The API provides a wealth of information about each card, including its converted mana cost (CMC), which is used to calculate the average mana cost of the deck. The application is built using React for the frontend, with React Hook Form for form handling and state management. Tailwind CSS is used for styling, ensuring a visually appealing and responsive user interface.

## Getting Started

### Prerequisites

* Node.js (version 14 or higher)
* npm (version 6 or higher)

### Install

1. Clone the repository:\
`git clone https://github.com/SuperStar0106/mtg-deck.git`
2. Navigate to the project directory:\
`cd MagicTheGatering`
3. Install the dependencies:\
`npm install`
4. Start the development server:\
`npm start`\
The application will be available at `http://localhost:3000`

### Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them to your branch.
4. Push your branch to your fork.
5. Open a pull request from your fork to the main repository.

### Acknowledgments

* Magic: The Gathering API for providing the card data.
* React and React Hook Form for building the user interface.
* Tailwind CSS for styling the application.

### Contact

If you have any questions or feedback, please feel free to contact me.
