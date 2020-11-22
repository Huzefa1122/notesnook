import React from "react";
import ReactDOM from "react-dom";
import { Flex, Text, Button as RebassButton } from "rebass";
import ThemeProvider from "../theme-provider";
import * as Icon from "../icons";
import Modal from "react-modal";
import { useTheme } from "emotion-theming";
import { getHashParam, setHashParam } from "../../utils/useHashParam";

function Dialog(props) {
  const theme = useTheme();
  return (
    <Modal
      isOpen={props.isOpen || false}
      onRequestClose={props.onClose}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      onAfterOpen={(e) => {
        // we need this work around because ReactModal content spreads over the overlay
        const child = e.contentEl.firstElementChild;
        e.contentEl.onclick = function (e) {
          if (
            e.x < child.offsetLeft ||
            e.x > child.offsetLeft + child.clientWidth ||
            e.y < child.offsetTop ||
            e.y > child.offsetTop + child.clientHeight
          ) {
            props.onClose();
          }
        };
      }}
      style={{
        content: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          backgroundColor: undefined,
          padding: 0,
          overflowY: "hidden",
          zIndex: 0,
        },
        overlay: {
          zIndex: 999,
          background: theme.colors.overlay,
        },
      }}
    >
      <Flex
        p={30}
        flexDirection="column"
        width={["100%", "90%", "33%"]}
        maxHeight={["100%", "80%", "70%"]}
        height={["100%", "auto", "auto"]}
        bg="background"
        alignSelf={"center"}
        m={[0, 2, 2]}
        sx={{
          position: "relative",
          overflow: "hidden",
          boxShadow: "4px 5px 18px 2px #00000038",
          borderRadius: "default",
        }}
      >
        {props.showClose && (
          <Icon.Close
            sx={{ position: "absolute", top: 0, right: 30, mt: 38 }}
            size={26}
            onClick={props.onClose}
          />
        )}
        <Flex
          variant="columnCenter"
          pb={2}
          mb={3}
          sx={{ borderBottom: "1px solid", borderColor: "border" }}
        >
          {/* {props.icon && (
            <props.icon size={props.iconSize || 38} color="primary" />
          )} */}
          <Text
            variant="heading"
            textAlign="center"
            color="text"
            mx={1}
            mt={props.icon && 1}
          >
            {props.title}
          </Text>
          {props.description && (
            <Text variant="body" textAlign="center" color="gray" mx={1} mt={1}>
              {props.description}
            </Text>
          )}
        </Flex>
        {props.children}

        {(props.positiveButton || props.negativeButton) && (
          <Flex
            sx={{ justifyContent: props.buttonsAlignment || "flex-end" }}
            mt={3}
          >
            {props.positiveButton && (
              <RebassButton
                {...props.positiveButton.props}
                variant="primary"
                data-test-id="dialog-yes"
                sx={{ opacity: props.positiveButton.disabled ? 0.7 : 1 }}
                mx={1}
                disabled={props.positiveButton.disabled || false}
                onClick={
                  !props.positiveButton.disabled
                    ? props.positiveButton.onClick
                    : undefined
                }
              >
                {props.positiveButton.loading ? (
                  <Icon.Loading rotate={true} color="static" />
                ) : (
                  props.positiveButton.text || "OK"
                )}
              </RebassButton>
            )}
            {props.negativeButton && (
              <RebassButton
                variant="secondary"
                data-test-id="dialog-no"
                onClick={props.negativeButton.onClick}
              >
                {props.negativeButton.text || "Cancel"}
              </RebassButton>
            )}
          </Flex>
        )}
        {props.footer}
      </Flex>
    </Modal>
  );
}

export default Dialog;

export function showDialog(dialog) {
  const root = document.getElementById("dialogContainer");

  if (root) {
    return new Promise((resolve) => {
      const perform = (result) => {
        window.removeEventListener("hashchange", onHashChange);
        ReactDOM.unmountComponentAtNode(root);
        resolve(result);
      };
      window.addEventListener("hashchange", onHashChange);

      function onHashChange() {
        if (!getHashParam("type")) perform(false);
      }

      setHashParam({ type: "dialog" });

      const PropDialog = dialog(perform);
      ReactDOM.render(<ThemeProvider>{PropDialog}</ThemeProvider>, root);
    });
  }
  return Promise.reject("No element with id 'dialogContainer'");
}
