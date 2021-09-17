import * as React from 'react';
import { Image } from 'react-native';
import { Button } from 'react-native-paper';
import { PieceColor, PieceType } from '../../types/types';
import { getPieceImage } from '../../utility/functions';

export type PawnPromotionButtonProps = {
  pieceType: PieceType;
  teamColor: PieceColor;
  tileSidelength: number;
  confirmPawnPromotion: (type: PieceType) => void;
  dismissPromotionPopup: () => void;
};

export default function PawnPromotionButton({
  pieceType,
  teamColor,
  tileSidelength,
  confirmPawnPromotion,
  dismissPromotionPopup,
}: PawnPromotionButtonProps): React.ReactElement {
  return (
    <Button
      icon={() => (
        <Image
          source={getPieceImage(pieceType, teamColor)}
          style={{
            width: tileSidelength * 1.5,
            height: tileSidelength * 1.5,
          }}
        />
      )}
      onPress={() => {
        confirmPawnPromotion(pieceType);
        dismissPromotionPopup();
      }}
    >
      {' '}
    </Button>
  );
}
