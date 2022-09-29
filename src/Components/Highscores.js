import React, { useState, useEffect } from "react";

export default function Highscore(props) {
  const scoreListItem = () => {
    if (props.highscores != null) {
      let scores = JSON.parse(props.highscores);
      return scores.map((item, index) => (
        <li key={index}>
          Runde {index + 1}: {item}
        </li>
      ));
    }
  };

  return (
    <div>
      <h2>Highscores!</h2>
      <ul>{scoreListItem()}</ul>
    </div>
  );
}
