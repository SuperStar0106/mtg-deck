import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  fetchAllCards,
  fetchAllTypes,
  fetchAllSubtypes,
} from "./utils/fetchCards";

import {
  Card,
  Pagination,
  LoadingSpinner,
  Select,
  Modal,
  Button,
  Combobox,
} from "./components";

import {
  MagnifyingGlassIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";

const App: React.FC = () => {
  const [cards, setCards] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(100);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [subTypeOptions, setSubTypeOptions] = useState<string[]>([]);

  const [searchParams, setSearchParams] = useState({
    cardName: "",
    color: [],
    type: [],
    subtype: [],
    text: "",
  });

  const [deck, setDeck] = useState<{ [key: string]: number }>({});

  const pageSizeOptions = [10, 20, 50, 100];
  const colorOptions = ["Red", "White", "Blue", "Black"];

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeckModalOpen, setIsDeckModalOpen] = useState<boolean>(false);

  const { control, setValue, getValues, register, handleSubmit } = useForm();

  const [averageCmc, setAverageCmc] = useState<number>(0);

  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchAllCards(
          page,
          pageSize,
          searchParams.cardName,
          searchParams.color,
          searchParams.type,
          searchParams.subtype,
          searchParams.text
        );
        setCards(result.data);
        setError(result.error);
      } catch (error) {
        setError("Failed to fetch cards.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [page, pageSize, searchParams]);

  useEffect(() => {
    const fetchTypesAndSubtypes = async () => {
      try {
        const typesResult = await fetchAllTypes();
        const subTypesResult = await fetchAllSubtypes();
        if (
          typesResult.data &&
          "types" in typesResult.data &&
          Array.isArray(typesResult.data.types)
        ) {
          setTypeOptions(typesResult.data.types);
        }

        if (
          subTypesResult.data &&
          "subtypes" in subTypesResult.data &&
          Array.isArray(subTypesResult.data.subtypes)
        ) {
          setSubTypeOptions(subTypesResult.data.subtypes);
        }
      } catch (error) {
        console.error("Failed to fetch types and subtypes:", error);
      }
    };

    fetchTypesAndSubtypes();
  }, []);

  useEffect(() => {
    const newAverageCmc = calculateAverageManaCost();
    setAverageCmc(newAverageCmc);
  }, [deck]);

  const onSubmit = async (data: any) => {
    setIsModalOpen(false);
    setIsLoading(true);
    setError(null);
    setPage(1);
    setSearchParams(data);
    console.log("submited data: ", data);
  };

  const addToDeck = (card: any) => {
    if (Object.keys(deck).length < 30) {
      setDeck((prevDeck) => ({
        ...prevDeck,
        [card.id]: (prevDeck[card.id] || 0) + 1,
      }));
    }
  };

  const removeFromDeck = (cardId: string) => {
    setDeck((prevDeck) => {
      const newDeck = { ...prevDeck };
      if (newDeck[cardId] > 1) {
        newDeck[cardId]--;
      } else {
        delete newDeck[cardId];
      }
      return newDeck;
    });
  };

  const calculateAverageManaCost = () => {
    let totalManaCost = 0;
    let totalCardCount = 0;

    for (const cardId in deck) {
      const count = deck[cardId];
      const card = cards?.cards.find((card: any) => card.id === cardId);
      if (card) {
        totalManaCost += card.cmc * count;
        totalCardCount += count;
      }
    }

    return totalCardCount > 0
      ? parseFloat((totalManaCost / totalCardCount).toFixed(2))
      : 0;
  };

  const isDeckFull = () => {
    let totalCardCount = 0;
    for (const cardId in deck) {
      totalCardCount += deck[cardId];
    }

    return totalCardCount >= 30;
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="app min-h-screen bg-gray-200 items-center justify-center pl-10 pr-10">
      <div className="flex pt-10 pb-10">
        <div className="w-30">
          <Select
            value={pageSize}
            options={pageSizeOptions}
            onChange={(newPageSize) => setPageSize(newPageSize)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 fade-in-up">
        {cards?.cards.map((card: any) => (
          <Card
            key={card.id}
            card={card}
            count={deck[card.id] || 0}
            btnText="Add"
            onClick={() => addToDeck(card)}
            isDeckFull={isDeckFull()}
          />
        ))}
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed top-1/3 left-4 animate-pulse-custom bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
        style={{ transform: "translateY(-50%)" }}
      >
        <MagnifyingGlassIcon className="w-10 h-10" />
      </button>
      <button
        className="fixed top-1/2 left-4 animate-pulse-custom bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
        style={{ transform: "translateY(-50%)" }}
      >
        {averageCmc.toFixed(2)}
      </button>
      <button
        onClick={() => setIsDeckModalOpen(true)}
        className="fixed top-2/3 left-4 animate-pulse-custom bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
        style={{ transform: "translateY(-50%)" }}
      >
        <CircleStackIcon className="w-10 h-10" />
      </button>
      <div className="pt-10">
        <Pagination
          currentPage={page}
          pageSize={10}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Card Information
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Use specific parameters to searh the cards.
                  </p>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="cardName"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Card Name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          id="cardName"
                          autoComplete="cardName"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3 pr-3"
                          {...register("cardName")}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 sm:col-start-1">
                      <label
                        htmlFor="color"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Color
                      </label>
                      <div className="mt-2">
                        <Combobox
                          name="color"
                          options={colorOptions}
                          control={control}
                          setValue={setValue}
                          getValue={getValues}
                          currentSelectedItems={getValues("color")}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Type
                      </label>
                      <div className="mt-2">
                        <Combobox
                          name="type"
                          options={typeOptions}
                          control={control}
                          setValue={setValue}
                          getValue={getValues}
                          currentSelectedItems={getValues("type")}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="subtype"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Sub Type
                      </label>
                      <div className="mt-2">
                        <Combobox
                          name="subtype"
                          options={subTypeOptions}
                          control={control}
                          setValue={setValue}
                          getValue={getValues}
                          currentSelectedItems={getValues("subtype")}
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="text"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Text
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="text"
                          rows={3}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3 pr-3"
                          defaultValue={""}
                          {...register("text")}
                        />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        Write down a few sentences to search for in the card
                        text.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              type="submit"
              text="Ok"
              className="bg-red-600 text-white hover:bg-red-500 sm:ml-3 sm:w-auto"
            />
            <Button
              type="button"
              text="Cancel"
              onClick={() => setIsModalOpen(false)}
              className="mt-3 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            />
          </div>
        </form>
      </Modal>
      <Modal isOpen={isDeckModalOpen} onClose={() => setIsDeckModalOpen(false)}>
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  My Deck
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Check cards in your Deck.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                  {Object.entries(deck).map(([cardId, count]) => {
                    const card = cards?.cards.find(
                      (card: any) => card.id === cardId
                    );
                    return card ? (
                      <Card
                        key={card.id}
                        card={card}
                        count={deck[card.id] || 0}
                        btnText="Remove"
                        onClick={() => removeFromDeck(card.id)}
                        isDeckFull={isDeckFull()}
                      />
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <Button
            type="button"
            text="Cancel"
            onClick={() => setIsDeckModalOpen(false)}
            className="mt-3 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          />
        </div>
      </Modal>
    </div>
  );
};

export default App;
