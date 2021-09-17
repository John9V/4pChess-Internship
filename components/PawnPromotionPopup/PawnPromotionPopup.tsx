import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Modal } from 'react-native-paper';
import { PieceColor, PieceType } from '../../types/types';
import PawnPromotionButton from '../PawnPromotionButton/PawnPromotionButton';

export type PawnPromotionPopupProps = {
  pawnPromotionPopupIsVisible: boolean;
  teamColor: PieceColor;
  tileSidelength: number;
  confirmPawnPromotion: (type: PieceType) => void;
  dismissPromotionPopup: () => void;
};

export default function PawnPromotionPopup({
  pawnPromotionPopupIsVisible,
  teamColor,
  tileSidelength,
  confirmPawnPromotion,
  dismissPromotionPopup,
}: PawnPromotionPopupProps): React.ReactElement {
  return (
    <Modal
      dismissable={false}
      style={styles.modal}
      contentContainerStyle={[styles.popup]}
      visible={pawnPromotionPopupIsVisible}
    >
      <Text style={styles.popupTitle}>Pawn Promotion</Text>
      <Text style={styles.popupDescription}>
        Please select the piece to promote the pawn to. Then select the center
        tile again to complete the move.
      </Text>
      <View style={styles.popupButtonSection}>
        <PawnPromotionButton
          pieceType={'rook'}
          teamColor={teamColor}
          tileSidelength={tileSidelength}
          confirmPawnPromotion={confirmPawnPromotion}
          dismissPromotionPopup={dismissPromotionPopup}
        />
        <PawnPromotionButton
          pieceType={'knight'}
          teamColor={teamColor}
          tileSidelength={tileSidelength}
          confirmPawnPromotion={confirmPawnPromotion}
          dismissPromotionPopup={dismissPromotionPopup}
        />
        <PawnPromotionButton
          pieceType={'queen'}
          teamColor={teamColor}
          tileSidelength={tileSidelength}
          confirmPawnPromotion={confirmPawnPromotion}
          dismissPromotionPopup={dismissPromotionPopup}
        />
        <PawnPromotionButton
          pieceType={'bishop'}
          teamColor={teamColor}
          tileSidelength={tileSidelength}
          confirmPawnPromotion={confirmPawnPromotion}
          dismissPromotionPopup={dismissPromotionPopup}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  popup: {
    display: 'flex',
    backgroundColor: 'white',
    width: '80%',
    height: '50%',
    marginBottom: '20%',
    padding: 30,
    alignSelf: 'center',
  },
  popupTitle: {
    flex: 2,
    alignSelf: 'flex-start',
    fontSize: 20,
  },
  popupDescription: {
    flex: 2,
    marginBottom: 20,
  },
  popupButtonSection: {
    flex: 5,
    flexDirection: 'row-reverse',
    alignSelf: 'center',
  },
  modal: {
    zIndex: 11,
  },
});
